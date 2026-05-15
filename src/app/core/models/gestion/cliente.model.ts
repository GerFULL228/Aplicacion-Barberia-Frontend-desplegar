import { Persona } from "./persona.model";

export interface Cliente {
  clienteId: number;
  persona: Persona;
  fechaRegistro: string;
}

