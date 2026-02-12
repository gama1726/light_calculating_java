package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EPResult {
    private int number;
    @JsonProperty("P_nom")
    private double P_nom;
    @JsonProperty("P_r")
    private double P_r;
    @JsonProperty("Q_r")
    private double Q_r;
    private double S;
    private double I;
    @JsonProperty("cos_phi")
    private double cos_phi;

    public int getNumber() { return number; } public void setNumber(int v) { this.number = v; }
    public double getP_nom() { return P_nom; } public void setP_nom(double v) { this.P_nom = v; }
    public double getP_r() { return P_r; } public void setP_r(double v) { this.P_r = v; }
    public double getQ_r() { return Q_r; } public void setQ_r(double v) { this.Q_r = v; }
    public double getS() { return S; } public void setS(double v) { this.S = v; }
    public double getI() { return I; } public void setI(double v) { this.I = v; }
    public double getCos_phi() { return cos_phi; } public void setCos_phi(double v) { this.cos_phi = v; }
}
