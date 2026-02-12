package com.electrical.calculation.tables;

import java.util.*;
import java.util.stream.Collectors;

public final class Tables {

    private static final Map<Double, Double> TABLE_ETA = new LinkedHashMap<>();
    static {
        TABLE_ETA.put(0.5, 0.11); TABLE_ETA.put(0.6, 0.14); TABLE_ETA.put(0.7, 0.16);
        TABLE_ETA.put(0.8, 0.18); TABLE_ETA.put(0.9, 0.20); TABLE_ETA.put(1.0, 0.22);
        TABLE_ETA.put(1.1, 0.24); TABLE_ETA.put(1.25, 0.26); TABLE_ETA.put(1.5, 0.29);
        TABLE_ETA.put(1.75, 0.31); TABLE_ETA.put(2.0, 0.33); TABLE_ETA.put(2.25, 0.35);
        TABLE_ETA.put(2.5, 0.36); TABLE_ETA.put(3.0, 0.39); TABLE_ETA.put(3.5, 0.40);
        TABLE_ETA.put(4.0, 0.42); TABLE_ETA.put(5.0, 0.44);
    }

    private static final double[][] TABLE_LED = {
        {3, 250}, {5, 400}, {10, 700}, {12, 900}, {15, 1200},
        {20, 1800}, {30, 2500}, {100, 1600}, {150, 2100}, {200, 3100},
        {250, 4000}, {300, 5100}, {500, 9800}, {1000, 21000}
    };
    private static final double[][] TABLE_LL = {
        {15, 630}, {20, 980}, {30, 1740}, {40, 2480}, {80, 4320}
    };

    public static final class TransformerRow {
        public final String model;
        public final double S_nom, R_tr, X_tr;
        TransformerRow(String model, double S_nom, double R_tr, double X_tr) {
            this.model = model; this.S_nom = S_nom; this.R_tr = R_tr; this.X_tr = X_tr;
        }
    }
    private static final List<TransformerRow> TRANSFORMERS = Arrays.asList(
        new TransformerRow("ТМ-63/10", 63, 0.037, 0.0705),
        new TransformerRow("ТМ-100/10", 100, 0.0227, 0.0408),
        new TransformerRow("ТМ-160/10", 160, 0.00435, 0.0102),
        new TransformerRow("ТМ-250/10", 250, 0.0067, 0.0156),
        new TransformerRow("ТМ-400/10", 400, 0.0037, 0.0106),
        new TransformerRow("ТМ-630/10", 630, 0.00212, 0.0085)
    );

    public static final class CableRow {
        public final double section, I_dop, r0, x0;
        CableRow(double section, double I_dop, double r0, double x0) {
            this.section = section; this.I_dop = I_dop; this.r0 = r0; this.x0 = x0;
        }
    }
    private static final List<CableRow> CABLES_VVG = Arrays.asList(
        new CableRow(1.5, 19, 12.1, 0.095), new CableRow(2.5, 25, 7.41, 0.091),
        new CableRow(4, 35, 4.61, 0.087), new CableRow(6, 42, 3.08, 0.083),
        new CableRow(10, 55, 1.83, 0.078), new CableRow(16, 75, 1.15, 0.073),
        new CableRow(25, 95, 0.727, 0.068), new CableRow(35, 120, 0.524, 0.064),
        new CableRow(50, 145, 0.387, 0.060), new CableRow(70, 180, 0.268, 0.056),
        new CableRow(95, 220, 0.193, 0.052), new CableRow(120, 260, 0.153, 0.050),
        new CableRow(150, 300, 0.124, 0.048), new CableRow(185, 340, 0.0991, 0.046),
        new CableRow(240, 410, 0.0754, 0.044)
    );

    private static final double[] BREAKER_NOMINALS = {6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400};

    public static final double ALPHA_PR = 1.85;
    public static final double C_COEFFICIENT = 72.4;
    public static final double K_SHOCK = 1.1;
    public static final double J_ECONOMIC = 2.0;
    public static final double RHO_GROUND = 40;
    public static final double K_SEASON = 1.6;

    public static double getEta(double i) {
        if (i <= 0.5) return TABLE_ETA.get(0.5);
        if (i >= 5.0) return TABLE_ETA.get(5.0);
        List<Double> keys = TABLE_ETA.keySet().stream().sorted().collect(Collectors.toList());
        for (int idx = 0; idx < keys.size(); idx++) {
            double key = keys.get(idx);
            if (i <= key) {
                if (idx == 0) return TABLE_ETA.get(key);
                double prevKey = keys.get(idx - 1);
                double ratio = (i - prevKey) / (key - prevKey);
                return TABLE_ETA.get(prevKey) + ratio * (TABLE_ETA.get(key) - TABLE_ETA.get(prevKey));
            }
        }
        return TABLE_ETA.get(5.0);
    }

    public static class LampSelection {
        public final double P_lamp_kw, Phi_selected;
        public final String lamp_model;
        LampSelection(double p, double phi, String m) { P_lamp_kw = p; Phi_selected = phi; lamp_model = m; }
    }
    public static LampSelection selectLamp(double phiRequired, String lampType) {
        double[][] table = "LED".equalsIgnoreCase(lampType) ? TABLE_LED : TABLE_LL;
        String prefix = "LED".equalsIgnoreCase(lampType) ? lampType + "-" : "ЛЛ-";
        for (double[] row : table) {
            if (row[1] >= phiRequired) {
                return new LampSelection(row[0] / 1000.0, row[1], prefix + (int) row[0] + "W");
            }
        }
        double[] last = table[table.length - 1];
        return new LampSelection(last[0] / 1000.0, last[1], prefix + (int) last[0] + "W");
    }

    public static TransformerRow selectTransformer(double S_required) {
        for (TransformerRow tr : TRANSFORMERS) {
            if (tr.S_nom >= S_required) return tr;
        }
        return TRANSFORMERS.get(TRANSFORMERS.size() - 1);
    }

    public static CableRow selectCableSection(double I_required) {
        for (CableRow c : CABLES_VVG) {
            if (c.I_dop >= I_required) return c;
        }
        return CABLES_VVG.get(CABLES_VVG.size() - 1);
    }

    public static CableRow getCableParams(double section) {
        for (CableRow c : CABLES_VVG) {
            if (Math.abs(c.section - section) < 0.1) return c;
        }
        return selectCableSection(0);
    }

    public static double getKs(double P_installed) {
        if (P_installed <= 5) return 1.0;
        if (P_installed <= 14) return 0.8;
        if (P_installed <= 20) return 0.65;
        if (P_installed <= 30) return 0.6;
        if (P_installed <= 40) return 0.55;
        if (P_installed <= 50) return 0.5;
        if (P_installed <= 60) return 0.48;
        return 0.45;
    }

    public static double selectBreaker(double I_min, double I_max) {
        for (double n : BREAKER_NOMINALS) {
            if (I_min <= n && n <= I_max) return n;
        }
        for (double n : BREAKER_NOMINALS) {
            if (n >= I_min) return n;
        }
        return BREAKER_NOMINALS[BREAKER_NOMINALS.length - 1];
    }

    public static List<CableRow> getCablesVvg() { return CABLES_VVG; }
}
