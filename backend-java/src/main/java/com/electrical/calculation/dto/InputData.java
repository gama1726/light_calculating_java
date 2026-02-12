package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class InputData {

    @JsonProperty("A")
    private double A;
    @JsonProperty("B")
    private double B;
    @JsonProperty("H")
    private double H;
    @JsonProperty("h_p")
    private double hP;
    @JsonProperty("h_c")
    private double hC;
    @JsonProperty("E_n")
    private double E_n;
    @JsonProperty("lamp_type")
    private String lampType;
    @JsonProperty("n_sockets")
    private int nSockets;
    @JsonProperty("P_nom_list")
    private List<Double> P_nom_list;
    @JsonProperty("cos_phi_list")
    private List<Double> cos_phi_list;
    private int category;
    @JsonProperty("U_HV")
    private double U_HV;
    @JsonProperty("L_KL")
    private double L_KL;
    @JsonProperty("S_fundament")
    private double S_fundament;
    @JsonProperty("rho_p")
    private double rhoP = 50.0;
    @JsonProperty("rho_s")
    private double rhoS = 30.0;
    @JsonProperty("rho_r")
    private double rhoR = 10.0;
    @JsonProperty("L_step")
    private double L_step = 2.25;
    @JsonProperty("I_otkl")
    private double I_otkl = 12.5;

    public double getA() { return A; }
    public void setA(double A) { this.A = A; }
    public double getB() { return B; }
    public void setB(double B) { this.B = B; }
    public double getH() { return H; }
    public void setH(double H) { this.H = H; }
    public double getHP() { return hP; }
    public void setHP(double hP) { this.hP = hP; }
    public double getHC() { return hC; }
    public void setHC(double hC) { this.hC = hC; }
    public double getE_n() { return E_n; }
    public void setE_n(double E_n) { this.E_n = E_n; }
    public String getLampType() { return lampType; }
    public void setLampType(String lampType) { this.lampType = lampType; }
    public int getNSockets() { return nSockets; }
    public void setNSockets(int nSockets) { this.nSockets = nSockets; }
    public List<Double> getP_nom_list() { return P_nom_list; }
    public void setP_nom_list(List<Double> P_nom_list) { this.P_nom_list = P_nom_list; }
    public List<Double> getCos_phi_list() { return cos_phi_list; }
    public void setCos_phi_list(List<Double> cos_phi_list) { this.cos_phi_list = cos_phi_list; }
    public int getCategory() { return category; }
    public void setCategory(int category) { this.category = category; }
    public double getU_HV() { return U_HV; }
    public void setU_HV(double U_HV) { this.U_HV = U_HV; }
    public double getL_KL() { return L_KL; }
    public void setL_KL(double L_KL) { this.L_KL = L_KL; }
    public double getS_fundament() { return S_fundament; }
    public void setS_fundament(double S_fundament) { this.S_fundament = S_fundament; }
    public double getRhoP() { return rhoP; }
    public void setRhoP(double rhoP) { this.rhoP = rhoP; }
    public double getRhoS() { return rhoS; }
    public void setRhoS(double rhoS) { this.rhoS = rhoS; }
    public double getRhoR() { return rhoR; }
    public void setRhoR(double rhoR) { this.rhoR = rhoR; }
    public double getL_step() { return L_step; }
    public void setL_step(double L_step) { this.L_step = L_step; }
    public double getI_otkl() { return I_otkl; }
    public void setI_otkl(double I_otkl) { this.I_otkl = I_otkl; }
}
