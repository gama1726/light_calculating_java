// Типы для данных расчёта

export interface InputData {
  A: number;
  B: number;
  H: number;
  h_p: number;
  h_c: number;
  E_n: number;
  lamp_type: 'LED' | 'LL';
  n_sockets: number;
  P_nom_list: number[];
  cos_phi_list: number[];
  category: number;
  U_HV: number;
  L_KL: number;
  S_fundament: number;
  rho_p?: number;
  rho_s?: number;
  rho_r?: number;
  L_step?: number;
  I_otkl?: number;
}

export interface LightingResult {
  h: number;
  i: number;
  S: number;
  eta: number;
  z: number;
  Phi_total: number;
  N_a: number;
  N_b: number;
  N: number;
  Phi_lamp: number;
  P_lamp: number;
  lamp_model: string;
  P_r_osv: number;
  Q_r_osv: number;
  S_r_osv: number;
  I_r_osv: number;
  E_n_a: number;
  n_a: number;
}

export interface SocketsResult {
  P_r_sockets: number;
  Q_r_sockets: number;
  S_r_sockets: number;
  I_r_sockets: number;
  Ks: number;
}

export interface EPResult {
  number: number;
  P_nom: number;
  P_r: number;
  Q_r: number;
  S: number;
  I: number;
  cos_phi: number;
}

export interface EPGroupResult {
  EP_list: EPResult[];
  P_sum: number;
  Q_sum: number;
  S_p: number;
  I_p: number;
  Krm: number;
}

export interface TransformerResult {
  S_total: number;
  n_tr: number;
  Kz_load: number;
  S_nom_req: number;
  transformer_model: string;
  S_nom: number;
  R_tr: number;
  X_tr: number;
}

export interface ConductorResult {
  name: string;
  I_r: number;
  section: number;
  cable_type: string;
  I_dop: number;
  length?: number;
  Delta_U?: number;
}

export interface BreakerResult {
  name: string;
  I_r: number;
  I_nom_breaker: number;
  poles: number;
  breaker_type: string;
  breaking_capacity: number;
}

export interface ShortCircuitResult {
  point: string;
  R_sum: number;
  X_sum: number;
  Z_eq: number;
  I_k3: number;
  I_shock: number;
  B_k: number;
  S_min: number;
}

export interface GroundingResult {
  I_g: number;
  R_allowed: number;
  R_f: number;
  R_isk: number;
  R_v: number;
  N_v: number;
  R_total: number;
  is_valid: boolean;
}

export interface CalculationResult {
  lighting: LightingResult;
  sockets: SocketsResult;
  ep_group: EPGroupResult;
  transformer: TransformerResult;
  conductors: ConductorResult[];
  breakers: BreakerResult[];
  short_circuit: ShortCircuitResult[];
  grounding: GroundingResult;
}






