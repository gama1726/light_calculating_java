package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class EPGroupResult {
    @JsonProperty("EP_list")
    private List<EPResult> EP_list;
    @JsonProperty("P_sum")
    private double P_sum;
    @JsonProperty("Q_sum")
    private double Q_sum;
    @JsonProperty("S_p")
    private double S_p;
    @JsonProperty("I_p")
    private double I_p;
    @JsonProperty("Krm")
    private double Krm;

    public List<EPResult> getEP_list() { return EP_list; } public void setEP_list(List<EPResult> v) { this.EP_list = v; }
    public double getP_sum() { return P_sum; } public void setP_sum(double v) { this.P_sum = v; }
    public double getQ_sum() { return Q_sum; } public void setQ_sum(double v) { this.Q_sum = v; }
    public double getS_p() { return S_p; } public void setS_p(double v) { this.S_p = v; }
    public double getI_p() { return I_p; } public void setI_p(double v) { this.I_p = v; }
    public double getKrm() { return Krm; } public void setKrm(double v) { this.Krm = v; }
}
