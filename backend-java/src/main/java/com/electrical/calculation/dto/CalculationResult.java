package com.electrical.calculation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class CalculationResult {
    private LightingResult lighting;
    private SocketsResult sockets;
    @JsonProperty("ep_group")
    private EPGroupResult ep_group;
    private TransformerResult transformer;
    private List<ConductorResult> conductors;
    private List<BreakerResult> breakers;
    @JsonProperty("short_circuit")
    private List<ShortCircuitResult> short_circuit;
    private GroundingResult grounding;

    public LightingResult getLighting() { return lighting; } public void setLighting(LightingResult v) { this.lighting = v; }
    public SocketsResult getSockets() { return sockets; } public void setSockets(SocketsResult v) { this.sockets = v; }
    public EPGroupResult getEp_group() { return ep_group; } public void setEp_group(EPGroupResult v) { this.ep_group = v; }
    public TransformerResult getTransformer() { return transformer; } public void setTransformer(TransformerResult v) { this.transformer = v; }
    public List<ConductorResult> getConductors() { return conductors; } public void setConductors(List<ConductorResult> v) { this.conductors = v; }
    public List<BreakerResult> getBreakers() { return breakers; } public void setBreakers(List<BreakerResult> v) { this.breakers = v; }
    public List<ShortCircuitResult> getShort_circuit() { return short_circuit; } public void setShort_circuit(List<ShortCircuitResult> v) { this.short_circuit = v; }
    public GroundingResult getGrounding() { return grounding; } public void setGrounding(GroundingResult v) { this.grounding = v; }
}
