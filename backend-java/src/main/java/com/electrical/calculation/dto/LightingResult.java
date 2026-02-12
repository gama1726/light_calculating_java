package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LightingResult {
    private double h;
    private double i;
    @JsonProperty("S")
    private double S;
    private double eta;
    private double z;
    @JsonProperty("Phi_total")
    private double Phi_total;
    @JsonProperty("N_a")
    private int N_a;
    @JsonProperty("N_b")
    private int N_b;
    @JsonProperty("N")
    private int N;
    @JsonProperty("Phi_lamp")
    private double Phi_lamp;
    @JsonProperty("P_lamp")
    private double P_lamp;
    @JsonProperty("lamp_model")
    private String lamp_model;
    @JsonProperty("P_r_osv")
    private double P_r_osv;
    @JsonProperty("Q_r_osv")
    private double Q_r_osv;
    @JsonProperty("S_r_osv")
    private double S_r_osv;
    @JsonProperty("I_r_osv")
    private double I_r_osv;
    @JsonProperty("E_n_a")
    private double E_n_a;
    @JsonProperty("n_a")
    private int n_a_emergency;

    public double getH() { return h; } public void setH(double h) { this.h = h; }
    public double getI() { return i; } public void setI(double i) { this.i = i; }
    public double getS() { return S; } public void setS(double S) { this.S = S; }
    public double getEta() { return eta; } public void setEta(double eta) { this.eta = eta; }
    public double getZ() { return z; } public void setZ(double z) { this.z = z; }
    public double getPhi_total() { return Phi_total; } public void setPhi_total(double v) { this.Phi_total = v; }
    @JsonProperty("N_a")
    public int getN_a() { return N_a; }
    @JsonProperty("N_a")
    public void setN_a(int v) { this.N_a = v; }
    public int getN_b() { return N_b; } public void setN_b(int v) { this.N_b = v; }
    public int getN() { return N; } public void setN(int N) { this.N = N; }
    public double getPhi_lamp() { return Phi_lamp; } public void setPhi_lamp(double v) { this.Phi_lamp = v; }
    public double getP_lamp() { return P_lamp; } public void setP_lamp(double v) { this.P_lamp = v; }
    public String getLamp_model() { return lamp_model; } public void setLamp_model(String v) { this.lamp_model = v; }
    public double getP_r_osv() { return P_r_osv; } public void setP_r_osv(double v) { this.P_r_osv = v; }
    public double getQ_r_osv() { return Q_r_osv; } public void setQ_r_osv(double v) { this.Q_r_osv = v; }
    public double getS_r_osv() { return S_r_osv; } public void setS_r_osv(double v) { this.S_r_osv = v; }
    public double getI_r_osv() { return I_r_osv; } public void setI_r_osv(double v) { this.I_r_osv = v; }
    public double getE_n_a() { return E_n_a; } public void setE_n_a(double v) { this.E_n_a = v; }
    public int getN_a_emergency() { return n_a_emergency; } public void setN_a_emergency(int v) { this.n_a_emergency = v; }
}
