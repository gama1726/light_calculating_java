package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GroundingResult {
    @JsonProperty("I_g")
    private double I_g;
    @JsonProperty("R_allowed")
    private double R_allowed;
    @JsonProperty("R_f")
    private double R_f;
    @JsonProperty("R_isk")
    private double R_isk;
    @JsonProperty("R_v")
    private double R_v;
    @JsonProperty("N_v")
    private int N_v;
    @JsonProperty("R_total")
    private double R_total;
    @JsonProperty("is_valid")
    private boolean is_valid;

    public double getI_g() { return I_g; } public void setI_g(double v) { this.I_g = v; }
    public double getR_allowed() { return R_allowed; } public void setR_allowed(double v) { this.R_allowed = v; }
    public double getR_f() { return R_f; } public void setR_f(double v) { this.R_f = v; }
    public double getR_isk() { return R_isk; } public void setR_isk(double v) { this.R_isk = v; }
    public double getR_v() { return R_v; } public void setR_v(double v) { this.R_v = v; }
    public int getN_v() { return N_v; } public void setN_v(int v) { this.N_v = v; }
    public double getR_total() { return R_total; } public void setR_total(double v) { this.R_total = v; }
    public boolean isIs_valid() { return is_valid; } public void setIs_valid(boolean v) { this.is_valid = v; }
}
