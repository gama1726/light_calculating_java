package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConductorResult {
    private String name;
    @JsonProperty("I_r")
    private double I_r;
    private double section;
    @JsonProperty("cable_type")
    private String cable_type;
    @JsonProperty("I_dop")
    private double I_dop;
    private Double length;
    @JsonProperty("Delta_U")
    private Double Delta_U;

    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public double getI_r() { return I_r; } public void setI_r(double v) { this.I_r = v; }
    public double getSection() { return section; } public void setSection(double v) { this.section = v; }
    public String getCable_type() { return cable_type; } public void setCable_type(String v) { this.cable_type = v; }
    public double getI_dop() { return I_dop; } public void setI_dop(double v) { this.I_dop = v; }
    public Double getLength() { return length; } public void setLength(Double v) { this.length = v; }
    public Double getDelta_U() { return Delta_U; } public void setDelta_U(Double v) { this.Delta_U = v; }
}
