package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BreakerResult {
    private String name;
    @JsonProperty("I_r")
    private double I_r;
    @JsonProperty("I_nom_breaker")
    private double I_nom_breaker;
    private int poles;
    @JsonProperty("breaker_type")
    private String breaker_type;
    @JsonProperty("breaking_capacity")
    private double breaking_capacity;

    public String getName() { return name; } public void setName(String v) { this.name = v; }
    public double getI_r() { return I_r; } public void setI_r(double v) { this.I_r = v; }
    public double getI_nom_breaker() { return I_nom_breaker; } public void setI_nom_breaker(double v) { this.I_nom_breaker = v; }
    public int getPoles() { return poles; } public void setPoles(int v) { this.poles = v; }
    public String getBreaker_type() { return breaker_type; } public void setBreaker_type(String v) { this.breaker_type = v; }
    public double getBreaking_capacity() { return breaking_capacity; } public void setBreaking_capacity(double v) { this.breaking_capacity = v; }
}
