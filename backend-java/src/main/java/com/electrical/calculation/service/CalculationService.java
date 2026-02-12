package com.electrical.calculation.service;

import com.electrical.calculation.dto.*;
import com.electrical.calculation.tables.Tables;
import com.electrical.calculation.tables.Tables.CableRow;
import com.electrical.calculation.tables.Tables.LampSelection;
import com.electrical.calculation.tables.Tables.TransformerRow;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.electrical.calculation.tables.Tables.*;

@Service
public class CalculationService {

    private static final double U_NOM = 0.38;
    private static final double K_ZAP = 1.4;
    private static final double P_UD = 1.2;
    private static final double K_C_EP = 0.8;
    private static final double KRM = 0.95;

    public CalculationResult calculateAll(InputData data) {
        LightingResult lighting = calculateLighting(data);
        SocketsResult sockets = calculateSockets(data);
        EPGroupResult epGroup = calculateEpGroup(data);
        TransformerResult transformer = calculateTransformer(
            lighting.getP_r_osv(), sockets.getS_r_sockets(), epGroup.getS_p(), data.getCategory()
        );
        List<ConductorResult> conductorsLighting = calculateConductorsLighting(lighting, data);
        List<ConductorResult> conductorsEp = calculateConductorsEp(epGroup, data);
        List<ConductorResult> conductorsFeed = calculateConductorsFeed(transformer.getS_total(), data);
        List<ConductorResult> conductors = new ArrayList<>(conductorsLighting);
        conductors.addAll(conductorsEp);
        conductors.addAll(conductorsFeed);
        List<BreakerResult> breakers = calculateBreakers(lighting, sockets, epGroup, conductors);
        List<ShortCircuitResult> shortCircuit = calculateShortCircuit(data, transformer, conductors);
        GroundingResult grounding = calculateGrounding(data, conductors);

        CalculationResult result = new CalculationResult();
        result.setLighting(lighting);
        result.setSockets(sockets);
        result.setEp_group(epGroup);
        result.setTransformer(transformer);
        result.setConductors(conductors);
        result.setBreakers(breakers);
        result.setShort_circuit(shortCircuit);
        result.setGrounding(grounding);
        return result;
    }

    private LightingResult calculateLighting(InputData data) {
        double h = data.getH() - data.getHP() - data.getHC();
        if (h <= 0) h = 0.1; // защита от деления на ноль
        double denom = h * (data.getA() + data.getB());
        if (denom <= 0) denom = 0.1;
        double i = (data.getA() * data.getB()) / denom;
        double S = data.getA() * data.getB();
        double eta = getEta(i);
        double z = "LED".equalsIgnoreCase(data.getLampType()) ? 1.3 : 1.9;
        double Phi_total = (data.getE_n() * K_ZAP * S * z) / eta;
        double lStep = data.getL_step() > 0 ? data.getL_step() : 2.25;
        int N_a = (int) Math.floor(data.getA() / lStep);
        if (N_a < 1) N_a = 1;
        int N_b = (int) Math.ceil(data.getB() / lStep);
        if (N_b < 1) N_b = 1;
        int N = N_a * N_b;
        double Phi_lamp = Phi_total / N;
        LampSelection sel = selectLamp(Phi_lamp, data.getLampType());
        double P_lamp = sel.P_lamp_kw * 1000;
        Phi_total = sel.Phi_selected * N;
        double P_r_osv = N * sel.P_lamp_kw;
        double cos_phi = 0.95;
        double tg_phi = Math.sqrt(1 / (cos_phi * cos_phi) - 1);
        double Q_r_osv = P_r_osv * tg_phi;
        double S_r_osv = Math.sqrt(P_r_osv * P_r_osv + Q_r_osv * Q_r_osv);
        double I_r_osv = S_r_osv / (Math.sqrt(3) * U_NOM * cos_phi);
        double E_n_a = 0.05 * data.getE_n();
        int n_a = (int) Math.ceil((E_n_a * K_ZAP * S * z) / (eta * sel.Phi_selected));

        LightingResult r = new LightingResult();
        r.setH(h); r.setI(i); r.setS(S); r.setEta(eta); r.setZ(z);
        r.setPhi_total(Phi_total); r.setN_a(N_a); r.setN_b(N_b); r.setN(N);
        r.setPhi_lamp(sel.Phi_selected); r.setP_lamp(P_lamp); r.setLamp_model(sel.lamp_model);
        r.setP_r_osv(P_r_osv); r.setQ_r_osv(Q_r_osv); r.setS_r_osv(S_r_osv); r.setI_r_osv(I_r_osv);
        r.setE_n_a(E_n_a); r.setN_a_emergency(n_a);
        return r;
    }

    private SocketsResult calculateSockets(InputData data) {
        double P_installed = P_UD * data.getNSockets();
        double Ks = getKs(P_installed);
        double P_r_sockets = P_UD * data.getNSockets() * Ks;
        double cos_phi = 0.9;
        double tg_phi = Math.sqrt(1 / (cos_phi * cos_phi) - 1);
        double Q_r_sockets = P_r_sockets * tg_phi;
        double S_r_sockets = Math.sqrt(P_r_sockets * P_r_sockets + Q_r_sockets * Q_r_sockets);
        double I_r_sockets = P_r_sockets / (Math.sqrt(3) * U_NOM * cos_phi);
        SocketsResult r = new SocketsResult();
        r.setP_r_sockets(P_r_sockets); r.setQ_r_sockets(Q_r_sockets);
        r.setS_r_sockets(S_r_sockets); r.setI_r_sockets(I_r_sockets); r.setKs(Ks);
        return r;
    }

    private EPGroupResult calculateEpGroup(InputData data) {
        List<EPResult> list = new ArrayList<>();
        double P_sum = 0, Q_sum = 0;
        List<Double> P_nom = data.getP_nom_list();
        List<Double> cos_phi_list = data.getCos_phi_list();
        for (int idx = 0; idx < P_nom.size(); idx++) {
            double P_nom_i = P_nom.get(idx);
            double cos_phi = cos_phi_list.get(idx);
            double P_r_i = K_C_EP * P_nom_i;
            double tg_phi = Math.sqrt(1 / (cos_phi * cos_phi) - 1);
            double Q_r_i = P_r_i * tg_phi;
            double S_i = Math.sqrt(P_r_i * P_r_i + Q_r_i * Q_r_i);
            double I_i = S_i / (Math.sqrt(3) * U_NOM);
            EPResult er = new EPResult();
            er.setNumber(idx + 1); er.setP_nom(P_nom_i); er.setP_r(P_r_i); er.setQ_r(Q_r_i);
            er.setS(S_i); er.setI(I_i); er.setCos_phi(cos_phi);
            list.add(er);
            P_sum += P_r_i;
            Q_sum += Q_r_i;
        }
        double S_p = KRM * Math.sqrt(P_sum * P_sum + Q_sum * Q_sum);
        double I_p = S_p / (Math.sqrt(3) * U_NOM);
        EPGroupResult r = new EPGroupResult();
        r.setEP_list(list); r.setP_sum(P_sum); r.setQ_sum(Q_sum); r.setS_p(S_p); r.setI_p(I_p); r.setKrm(KRM);
        return r;
    }

    private TransformerResult calculateTransformer(double S_r_osv, double S_r_sockets, double S_p, int category) {
        double S_total = S_r_osv + S_r_sockets + S_p;
        int n_tr; double Kz_load;
        if (category == 1 || category == 2) { n_tr = 2; Kz_load = 0.75; }
        else { n_tr = 1; Kz_load = 0.85; }
        double S_nom_req = S_total / (n_tr * Kz_load);
        TransformerRow tr = selectTransformer(S_nom_req);
        TransformerResult r = new TransformerResult();
        r.setS_total(S_total); r.setN_tr(n_tr); r.setKz_load(Kz_load);
        r.setS_nom_req(S_nom_req); r.setTransformer_model(tr.model);
        r.setS_nom(tr.S_nom); r.setR_tr(tr.R_tr); r.setX_tr(tr.X_tr);
        return r;
    }

    private List<ConductorResult> calculateConductorsLighting(LightingResult lighting, InputData data) {
        List<ConductorResult> results = new ArrayList<>();
        double lStep = data.getL_step() > 0 ? data.getL_step() : 2.25;
        double P_row_W = lighting.getN_a() * lighting.getP_lamp();
        double L_row_m = 1 + lStep * (lighting.getN_a() - 1);
        double m_i_Wm = P_row_W * L_row_m;
        double M_sum_Wm = lighting.getN_b() * m_i_Wm;
        double M0_Wm = 0.5 * (lighting.getP_r_osv() * 1000);
        double Delta_U_dop = 5.5;
        double S0 = (M0_Wm + ALPHA_PR * M_sum_Wm) / (C_COEFFICIENT * Delta_U_dop);
        CableRow cable0 = null;
        for (CableRow c : getCablesVvg()) {
            if (c.section >= S0) { cable0 = c; break; }
        }
        if (cable0 == null) cable0 = selectCableSection(0);
        double cos_phi = 0.95;
        double I_line = lighting.getP_r_osv() / (Math.sqrt(3) * U_NOM * cos_phi);
        if (I_line > cable0.I_dop) cable0 = selectCableSection(I_line);
        double Delta_U_fact = M0_Wm / (C_COEFFICIENT * cable0.section);
        ConductorResult cr = new ConductorResult();
        cr.setName("Питающая линия освещения");
        cr.setI_r(I_line); cr.setSection(cable0.section); cr.setCable_type("ВВГ");
        cr.setI_dop(cable0.I_dop); cr.setLength(0.0005); cr.setDelta_U(Delta_U_fact);
        results.add(cr);
        double Delta_U_row_dop = Delta_U_dop - Delta_U_fact;
        if (Delta_U_row_dop > 0) {
            double S_row = m_i_Wm / (C_COEFFICIENT * Delta_U_row_dop);
            CableRow cable_row = null;
            for (CableRow c : getCablesVvg()) {
                if (c.section >= S_row) { cable_row = c; break; }
            }
            if (cable_row == null) cable_row = selectCableSection(0);
            double P_row_kW = P_row_W / 1000.0;
            double I_row = P_row_kW / (Math.sqrt(3) * U_NOM * cos_phi);
            if (I_row > cable_row.I_dop) cable_row = selectCableSection(I_row);
            ConductorResult cr2 = new ConductorResult();
            cr2.setName("Отходящая линия на ряд светильников");
            cr2.setI_r(I_row); cr2.setSection(cable_row.section); cr2.setCable_type("ВВГ");
            cr2.setI_dop(cable_row.I_dop); cr2.setLength(L_row_m / 1000.0); cr2.setDelta_U(Delta_U_row_dop);
            results.add(cr2);
        }
        return results;
    }

    private List<ConductorResult> calculateConductorsEp(EPGroupResult epGroup, InputData data) {
        List<ConductorResult> results = new ArrayList<>();
        double Kz_line = 1.25;
        for (EPResult ep : epGroup.getEP_list()) {
            double I_required = ep.getI() * Kz_line;
            CableRow cable = selectCableSection(I_required);
            ConductorResult cr = new ConductorResult();
            cr.setName("Линия к ЭП №" + ep.getNumber());
            cr.setI_r(ep.getI()); cr.setSection(cable.section); cr.setCable_type("ВВГ");
            cr.setI_dop(cable.I_dop); cr.setLength(0.05);
            results.add(cr);
        }
        return results;
    }

    private List<ConductorResult> calculateConductorsFeed(double S_total, InputData data) {
        List<ConductorResult> results = new ArrayList<>();
        double I_feed = S_total / (Math.sqrt(3) * U_NOM);
        double S_feed = I_feed / J_ECONOMIC;
        CableRow cable = null;
        for (CableRow c : getCablesVvg()) {
            if (c.section >= S_feed) { cable = c; break; }
        }
        if (cable == null) cable = selectCableSection(0);
        int n_cables = (int) Math.ceil(I_feed / cable.I_dop);
        if (n_cables == 0) n_cables = 1;
        ConductorResult cr = new ConductorResult();
        cr.setName("Питающая линия ТП-ВРУ (" + n_cables + " кабелей)");
        cr.setI_r(I_feed); cr.setSection(cable.section);
        cr.setCable_type("ВВГ (" + n_cables + "×" + (int) cable.section + ")");
        cr.setI_dop(cable.I_dop * n_cables); cr.setLength(data.getL_KL());
        results.add(cr);
        return results;
    }

    private List<BreakerResult> calculateBreakers(LightingResult lighting, SocketsResult sockets,
                                                   EPGroupResult epGroup, List<ConductorResult> conductors) {
        List<BreakerResult> results = new ArrayList<>();
        double I_max = conductors.stream().filter(c -> c.getName().contains("освещения"))
            .map(ConductorResult::getI_dop).findFirst().orElse(100.0);
        double I_nom = selectBreaker(lighting.getI_r_osv() * 1.13, I_max);
        BreakerResult br = new BreakerResult();
        br.setName("Автоматический выключатель освещения");
        br.setI_r(lighting.getI_r_osv()); br.setI_nom_breaker(I_nom); br.setPoles(3);
        br.setBreaker_type("ABB S203N/AC16 " + (int) I_nom + "A"); br.setBreaking_capacity(16.0);
        results.add(br);
        I_nom = selectBreaker(sockets.getI_r_sockets() * 1.13, 100);
        br = new BreakerResult();
        br.setName("Автоматический выключатель розеточной сети");
        br.setI_r(sockets.getI_r_sockets()); br.setI_nom_breaker(I_nom); br.setPoles(3);
        br.setBreaker_type("ABB S203N/AC16 " + (int) I_nom + "A"); br.setBreaking_capacity(16.0);
        results.add(br);
        for (EPResult ep : epGroup.getEP_list()) {
            double I_maxEp = conductors.stream().filter(c -> c.getName().contains("ЭП №" + ep.getNumber()))
                .map(ConductorResult::getI_dop).findFirst().orElse(100.0);
            I_nom = selectBreaker(ep.getI() * 1.45, I_maxEp);
            br = new BreakerResult();
            br.setName("Автоматический выключатель ЭП №" + ep.getNumber());
            br.setI_r(ep.getI()); br.setI_nom_breaker(I_nom); br.setPoles(3);
            br.setBreaker_type("ABB S203N/AC16 " + (int) I_nom + "A"); br.setBreaking_capacity(16.0);
            results.add(br);
        }
        return results;
    }

    private List<ShortCircuitResult> calculateShortCircuit(InputData data, TransformerResult transformer,
                                                            List<ConductorResult> conductors) {
        List<ShortCircuitResult> results = new ArrayList<>();
        double U_HV = data.getU_HV();
        double U_LV = 0.4;
        double I_otkl = data.getI_otkl();
        double X_sys = (U_HV / (Math.sqrt(3) * I_otkl)) * Math.pow(U_LV / U_HV, 2) * 1000;
        double R_tr = transformer.getR_tr();
        double X_tr = transformer.getX_tr();
        ConductorResult feedCable = conductors.stream().filter(c -> c.getName().contains("ТП-ВРУ")).findFirst().orElse(null);
        double R_line = 0, X_line = 0;
        if (feedCable != null) {
            CableRow params = getCableParams(feedCable.getSection());
            R_line = params.r0 * data.getL_KL();
            X_line = params.x0 * data.getL_KL();
        }
        double R_sum_1 = R_tr + R_line;
        double X_sum_1 = X_sys + X_tr + X_line;
        double Z_eq_1 = Math.sqrt(R_sum_1 * R_sum_1 + X_sum_1 * X_sum_1);
        double I_k3_1 = U_LV / (Math.sqrt(3) * Z_eq_1);
        double I_shock_1 = Math.sqrt(2) * I_k3_1 * K_SHOCK;
        double t_trip = 0.5;
        double B_k_1 = I_k3_1 * I_k3_1 * t_trip;
        double S_min_1 = Math.sqrt(B_k_1 * 1000 / 90);
        ShortCircuitResult sc1 = new ShortCircuitResult();
        sc1.setPoint("ТП (шины)"); sc1.setR_sum(R_sum_1); sc1.setX_sum(X_sum_1); sc1.setZ_eq(Z_eq_1);
        sc1.setI_k3(I_k3_1); sc1.setI_shock(I_shock_1); sc1.setB_k(B_k_1); sc1.setS_min(S_min_1);
        results.add(sc1);
        double R_sum_2 = R_tr + R_line;
        double X_sum_2 = X_sys + X_tr + X_line;
        double Z_eq_2 = Math.sqrt(R_sum_2 * R_sum_2 + X_sum_2 * X_sum_2);
        double I_k3_2 = U_LV / (Math.sqrt(3) * Z_eq_2);
        double I_shock_2 = Math.sqrt(2) * I_k3_2 * K_SHOCK;
        double B_k_2 = I_k3_2 * I_k3_2 * t_trip;
        double S_min_2 = Math.sqrt(B_k_2 * 1000 / 90);
        ShortCircuitResult sc2 = new ShortCircuitResult();
        sc2.setPoint("ЭП (конец линии)"); sc2.setR_sum(R_sum_2); sc2.setX_sum(X_sum_2); sc2.setZ_eq(Z_eq_2);
        sc2.setI_k3(I_k3_2); sc2.setI_shock(I_shock_2); sc2.setB_k(B_k_2); sc2.setS_min(S_min_2);
        results.add(sc2);
        return results;
    }

    private GroundingResult calculateGrounding(InputData data, List<ConductorResult> conductors) {
        double I_g = data.getU_HV() * data.getL_KL() / 10;
        double R_allowed_1 = I_g > 0 ? 250 / I_g : 10;
        double R_allowed = Math.min(R_allowed_1, 10.0);
        R_allowed = Math.min(R_allowed, 4.0);
        double R_f = RHO_GROUND / Math.sqrt(data.getS_fundament());
        double R_isk = R_f > R_allowed ? (R_f * R_allowed) / (R_f - R_allowed) : R_allowed;
        double R_v = 0.3 * RHO_GROUND * K_SEASON;
        double eta_v = 0.78;
        int N_v = (int) Math.ceil(R_v / (R_isk * eta_v));
        double R_v_parallel = R_v / (N_v * eta_v);
        double R_total = (R_f * R_v_parallel) / (R_f + R_v_parallel);
        boolean is_valid = R_total <= R_allowed && R_total < 4.0;
        GroundingResult r = new GroundingResult();
        r.setI_g(I_g); r.setR_allowed(R_allowed); r.setR_f(R_f); r.setR_isk(R_isk);
        r.setR_v(R_v); r.setN_v(N_v); r.setR_total(R_total); r.setIs_valid(is_valid);
        return r;
    }
}
