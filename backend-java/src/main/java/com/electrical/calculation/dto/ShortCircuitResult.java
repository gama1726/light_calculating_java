package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ShortCircuitResult {
    private String point;
    @JsonProperty("R_sum")
    private double R_sum;
    @JsonProperty("X_sum")
    private double X_sum;
    @JsonProperty("Z_eq")
    private double Z_eq;
    @JsonProperty("I_k3")
    private double I_k3;
    @JsonProperty("I_shock")
    private double I_shock;
    @JsonProperty("B_k")
    private double B_k;
    @JsonProperty("S_min")
    private double S_min;

    public String getPoint() { return point; } public void setPoint(String v) { this.point = v; }
    public double getR_sum() { return R_sum; } public void setR_sum(double v) { this.R_sum = v; }
    public double getX_sum() { return X_sum; } public void setX_sum(double v) { this.X_sum = v; }
    public double getZ_eq() { return Z_eq; } public void setZ_eq(double v) { this.Z_eq = v; }
    public double getI_k3() { return I_k3; } public void setI_k3(double v) { this.I_k3 = v; }
    public double getI_shock() { return I_shock; } public void setI_shock(double v) { this.I_shock = v; }
    public double getB_k() { return B_k; } public void setB_k(double v) { this.B_k = v; }
    public double getS_min() { return S_min; } public void setS_min(double v) { this.S_min = v; }
}
