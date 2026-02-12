package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TransformerResult {
    @JsonProperty("S_total")
    private double S_total;
    @JsonProperty("n_tr")
    private int n_tr;
    @JsonProperty("Kz_load")
    private double Kz_load;
    @JsonProperty("S_nom_req")
    private double S_nom_req;
    @JsonProperty("transformer_model")
    private String transformer_model;
    @JsonProperty("S_nom")
    private double S_nom;
    @JsonProperty("R_tr")
    private double R_tr;
    @JsonProperty("X_tr")
    private double X_tr;

    public double getS_total() { return S_total; } public void setS_total(double v) { this.S_total = v; }
    public int getN_tr() { return n_tr; } public void setN_tr(int v) { this.n_tr = v; }
    public double getKz_load() { return Kz_load; } public void setKz_load(double v) { this.Kz_load = v; }
    public double getS_nom_req() { return S_nom_req; } public void setS_nom_req(double v) { this.S_nom_req = v; }
    public String getTransformer_model() { return transformer_model; } public void setTransformer_model(String v) { this.transformer_model = v; }
    public double getS_nom() { return S_nom; } public void setS_nom(double v) { this.S_nom = v; }
    public double getR_tr() { return R_tr; } public void setR_tr(double v) { this.R_tr = v; }
    public double getX_tr() { return X_tr; } public void setX_tr(double v) { this.X_tr = v; }
}
