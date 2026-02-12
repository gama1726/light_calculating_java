package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SocketsResult {
    @JsonProperty("P_r_sockets")
    private double P_r_sockets;
    @JsonProperty("Q_r_sockets")
    private double Q_r_sockets;
    @JsonProperty("S_r_sockets")
    private double S_r_sockets;
    @JsonProperty("I_r_sockets")
    private double I_r_sockets;
    @JsonProperty("Ks")
    private double Ks;

    public double getP_r_sockets() { return P_r_sockets; } public void setP_r_sockets(double v) { this.P_r_sockets = v; }
    public double getQ_r_sockets() { return Q_r_sockets; } public void setQ_r_sockets(double v) { this.Q_r_sockets = v; }
    public double getS_r_sockets() { return S_r_sockets; } public void setS_r_sockets(double v) { this.S_r_sockets = v; }
    public double getI_r_sockets() { return I_r_sockets; } public void setI_r_sockets(double v) { this.I_r_sockets = v; }
    public double getKs() { return Ks; } public void setKs(double v) { this.Ks = v; }
}
