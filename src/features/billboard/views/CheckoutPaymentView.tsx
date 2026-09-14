import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  CreditCard,
  Landmark,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type {
  CheckoutSessionData,
  PaymentMethodType,
} from "../interfaces/payment.interface";
import { paymentService } from "../services/paymentService";
import { BackToHomeButton } from "@/shared/components";

const COLOMBIAN_BANKS = [
  { id: "1007", name: "Bancolombia" },
  { id: "1040", name: "Banco Agrario" },
  { id: "1052", name: "Banco AV Villas" },
  { id: "1013", name: "Banco BBVA Colombia" },
  { id: "1023", name: "Banco de Bogotá" },
  { id: "1001", name: "Banco de Occidente" },
  { id: "1051", name: "Banco Davivienda" },
  { id: "1002", name: "Banco Popular" },
  { id: "1507", name: "Nequi" },
  { id: "1551", name: "Daviplata" },
];

export const CheckoutPaymentView: React.FC = () => {
  const navigate = useNavigate();

  // 1. Inicialización diferida: lee sessionStorage una sola vez sin disparar cascada de renders
  const [sessionData] = useState<CheckoutSessionData | null>(() => {
    const raw = sessionStorage.getItem("checkout_selection");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CheckoutSessionData;
    } catch {
      return null;
    }
  });

  const [activeMethod, setActiveMethod] = useState<PaymentMethodType>("card");
  const [loading, setLoading] = useState(false);

  // Campos Tarjeta
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [email, setEmail] = useState("");

  // Campos PSE
  const [selectedBank, setSelectedBank] = useState("");
  const [docType, setDocType] = useState<"CC" | "CE" | "NIT" | "PP">("CC");
  const [docNumber, setDocNumber] = useState("");
  const [personType, setPersonType] = useState<"natural" | "juridica">(
    "natural",
  );

  // 2. Redirección protectora si no hay selección de sillas activa
  useEffect(() => {
    if (!sessionData) {
      alert("No hay sillas seleccionadas para procesar.");
      navigate("/movies");
    }
  }, [sessionData, navigate]);

  // Formateadores automáticos de entrada
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpirationDate(val);
  };

  const totalFee = useMemo(() => {
    return 2500; // Tarifa por servicio estimada ($2.500 COP)
  }, []);

  const grandTotal = useMemo(() => {
    return (sessionData?.totalPrice || 0) + totalFee;
  }, [sessionData, totalFee]);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionData) return;

    setLoading(true);

    try {
      const payload = {
        reservationId: sessionData.reservationId,
        functionId: sessionData.functionId,
        seats: sessionData.seats.map((s) => s.id),
        totalAmount: grandTotal,
        paymentMethod: activeMethod,
        customer: {
          email: email || "usuario.cine@gmail.com",
          fullName: cardHolder || "Comprador Cine",
        },
        cardDetails:
          activeMethod === "card"
            ? {
                cardNumber: cardNumber.replace(/\s/g, ""),
                cardHolder,
                expirationDate,
                cvv,
                installments,
              }
            : undefined,
        pseDetails:
          activeMethod === "pse"
            ? {
                bankCode: selectedBank,
                docType,
                docNumber,
                personType,
                phoneNumber: "3000000000",
              }
            : undefined,
      };

      const response = await paymentService.processPayment(payload, sessionData.seats);

      // Guardamos la confirmación para el comprobante / ticket digital (HU-13)
      sessionStorage.setItem(
        "order_confirmation",
        JSON.stringify({
          orderId: response.orderId,
          seats: sessionData.seats,
          totalPaid: grandTotal,
          date: response.transactionDate,
        }),
      );

      // Limpiamos la reserva temporal
      sessionStorage.removeItem("checkout_selection");

      navigate("/checkout/success");
    } catch (err) {
      console.error(err);
      alert(
        "Hubo un inconveniente al procesar el pago. Por favor intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!sessionData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#070913] text-[#e8e8ed] px-4 sm:px-8 py-8 selection:bg-purple-600 selection:text-white pb-20">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navegación superior */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Volver a selección de sillas
          </button>
          <BackToHomeButton />
        </div>

        <header>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Pasarela de Pago
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Selecciona tu medio de pago para confirmar tus boletas de forma
            segura.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Columna Izquierda: Formulario de Pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pestañas de método */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#111424] border border-white/10 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveMethod("card")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeMethod === "card"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CreditCard className="size-4" />
                Tarjeta Crédito / Débito
              </button>

              <button
                type="button"
                onClick={() => setActiveMethod("pse")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeMethod === "pse"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Landmark className="size-4" />
                PSE (Cuentas Débito)
              </button>
            </div>

            {/* Formulario */}
            <form
              onSubmit={handleSubmitPayment}
              className="bg-[#111424]/90 border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Correo Electrónico (para recibir tus boletas)
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#070913] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {activeMethod === "card" ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Nombre en la Tarjeta
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="JUAN BOLIVAR"
                      value={cardHolder}
                      onChange={(e) =>
                        setCardHolder(e.target.value.toUpperCase())
                      }
                      className="w-full bg-[#070913] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-[#070913] border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Expiración
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        value={expirationDate}
                        onChange={handleExpirationChange}
                        className="w-full bg-[#070913] border border-white/15 rounded-xl px-3 py-2.5 text-xs font-mono text-center text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        CVV
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full bg-[#070913] border border-white/15 rounded-xl px-3 py-2.5 text-xs font-mono text-center text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Cuotas
                      </label>
                      <select
                        value={installments}
                        onChange={(e) =>
                          setInstallments(Number(e.target.value))
                        }
                        className="w-full bg-[#070913] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition cursor-pointer"
                      >
                        {[1, 2, 3, 6, 12, 24, 36].map((num) => (
                          <option
                            key={num}
                            value={num}
                            className="bg-[#111424]"
                          >
                            {num} {num === 1 ? "cuota" : "cuotas"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Entidad Bancaria
                    </label>
                    <select
                      required
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-[#070913] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition cursor-pointer"
                    >
                      <option value="">Selecciona tu banco o billetera</option>
                      {COLOMBIAN_BANKS.map((b) => (
                        <option
                          key={b.id}
                          value={b.id}
                          className="bg-[#111424]"
                        >
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Tipo de Documento
                      </label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as "CC")}
                        className="w-full bg-[#070913] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition cursor-pointer"
                      >
                        <option value="CC" className="bg-[#111424]">
                          Cédula de Ciudadanía (CC)
                        </option>
                        <option value="CE" className="bg-[#111424]">
                          Cédula de Extranjería (CE)
                        </option>
                        <option value="NIT" className="bg-[#111424]">
                          NIT
                        </option>
                        <option value="PP" className="bg-[#111424]">
                          Pasaporte (PP)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Número de Documento
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="1045..."
                        value={docNumber}
                        onChange={(e) =>
                          setDocNumber(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full bg-[#070913] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Tipo de Persona
                    </label>
                    <div className="flex gap-4 pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="personType"
                          checked={personType === "natural"}
                          onChange={() => setPersonType("natural")}
                          className="accent-purple-600"
                        />
                        Persona Natural
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="personType"
                          checked={personType === "juridica"}
                          onChange={() => setPersonType("juridica")}
                          className="accent-purple-600"
                        />
                        Persona Jurídica
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="size-4 text-green-400 shrink-0" />
                <span>
                  Pago procesado con cifrado seguro de 256-bits. No almacenamos
                  datos sensibles.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-purple-600/30 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Procesando transacción bancaria...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    Pagar ${grandTotal.toLocaleString()} COP
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Columna Derecha: Resumen del Pedido */}
          <div className="bg-[#111424]/90 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl sticky top-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-3">
              Resumen del Pedido
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Función:</span>
                <span className="font-semibold text-white">
                  {sessionData.functionId}
                </span>
              </div>

              <div className="flex justify-between items-start text-xs">
                <span className="text-slate-400">
                  Sillas ({sessionData.seats.length}):
                </span>
                <span className="font-bold text-purple-300 text-right">
                  {sessionData.seats.map((s) => s.id).join(", ")}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal boletas</span>
                <span>${sessionData.totalPrice.toLocaleString()} COP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tarifa por servicio digital</span>
                <span>${totalFee.toLocaleString()} COP</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-white/10 font-bold">
                <span className="text-sm text-white">Total a Pagar</span>
                <span className="text-lg text-purple-400 font-mono">
                  ${grandTotal.toLocaleString()} COP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentView;
