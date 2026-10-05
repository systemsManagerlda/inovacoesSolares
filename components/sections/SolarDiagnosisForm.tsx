"use client";

import { useMemo, useState } from "react";
import {
  Home,
  Building2,
  Factory,
  Sprout,
  Droplets,
  Zap,
  BatteryCharging,
  CheckCircle2,
  Plus,
  Minus,
  MessageCircle,
  Sun,
} from "lucide-react";

type Equipment = {
  id: string;
  name: string;
  icon?: string;
  quantity: number;
};

const residentialEquipment: Equipment[] = [
  { id: "frigorifico", name: "Frigorífico", quantity: 0 },
  { id: "congelador", name: "Congelador", quantity: 0 },
  { id: "ar", name: "Ar condicionado", quantity: 0 },
  { id: "televisao", name: "Televisão", quantity: 0 },
  { id: "ventoinha", name: "Ventoinha", quantity: 0 },
  { id: "maquina-lavar", name: "Máquina de lavar", quantity: 0 },
  { id: "ferro", name: "Ferro de engomar", quantity: 0 },
  { id: "microondas", name: "Micro-ondas", quantity: 0 },
  { id: "fogao", name: "Fogão eléctrico", quantity: 0 },
  { id: "bomba-agua", name: "Bomba de água", quantity: 0 },
  { id: "computador", name: "Computador", quantity: 0 },
  { id: "iluminacao", name: "Iluminação", quantity: 0 },
];

const agriculturalEquipment: Equipment[] = [
  { id: "bomba-submersivel", name: "Bomba submersível", quantity: 0 },
  { id: "bomba-superficie", name: "Bomba de superfície", quantity: 0 },
  { id: "bomba-irrigacao", name: "Bomba de irrigação", quantity: 0 },
  { id: "motor-electrico", name: "Motor eléctrico", quantity: 0 },
  { id: "camara-frigorifica", name: "Câmara frigorífica", quantity: 0 },
  { id: "ordenhadora", name: "Ordenhadora", quantity: 0 },
  { id: "avicultura", name: "Equipamentos de avicultura", quantity: 0 },
  { id: "estufa", name: "Equipamentos de estufa", quantity: 0 },
  { id: "processamento", name: "Máquinas de processamento", quantity: 0 },
  { id: "iluminacao-agricola", name: "Iluminação", quantity: 0 },
];

const commercialEquipment: Equipment[] = [
  { id: "ar-comercial", name: "Ar condicionado", quantity: 0 },
  { id: "frigorifico-comercial", name: "Frigoríficos", quantity: 0 },
  { id: "congelador-comercial", name: "Congeladores", quantity: 0 },
  { id: "computadores", name: "Computadores", quantity: 0 },
  { id: "impressoras", name: "Impressoras", quantity: 0 },
  { id: "iluminacao-comercial", name: "Iluminação", quantity: 0 },
  { id: "bombas-comercial", name: "Bombas de água", quantity: 0 },
  { id: "maquinas", name: "Máquinas/equipamentos", quantity: 0 },
];

const industrialEquipment: Equipment[] = [
  { id: "motores", name: "Motores eléctricos", quantity: 0 },
  { id: "compressores", name: "Compressores", quantity: 0 },
  { id: "bombas-industriais", name: "Bombas industriais", quantity: 0 },
  { id: "maquinas-industriais", name: "Máquinas industriais", quantity: 0 },
  { id: "frio-industrial", name: "Refrigeração industrial", quantity: 0 },
  { id: "iluminacao-industrial", name: "Iluminação", quantity: 0 },
];

const typeOptions = [
  {
    id: "residencial",
    title: "Residencial",
    description: "Casa ou apartamento",
    icon: Home,
  },
  {
    id: "comercial",
    title: "Comercial",
    description: "Loja, escritório ou negócio",
    icon: Building2,
  },
  {
    id: "industrial",
    title: "Industrial",
    description: "Fábrica ou unidade industrial",
    icon: Factory,
  },
  {
    id: "agricola",
    title: "Agrícola",
    description: "Quinta, irrigação ou produção",
    icon: Sprout,
  },
];

export default function SolarDiagnosisForm() {
  const [projectType, setProjectType] = useState("");
  const [typology, setTypology] = useState("");
  const [province, setProvince] = useState("");
  const [area, setArea] = useState("");

  const [equipment, setEquipment] = useState<Equipment[]>([]);

  const [edm, setEdm] = useState("");
  const [consumptionType, setConsumptionType] = useState("");
  const [consumption, setConsumption] = useState("");

  const [priority, setPriority] = useState("");

  const [agriculturalActivity, setAgriculturalActivity] =
    useState("");

  const [pumpPower, setPumpPower] = useState("");
  const [pumpHours, setPumpHours] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);

  function selectProjectType(type: string) {
    setProjectType(type);

    if (type === "residencial") {
      setEquipment(
        residentialEquipment.map((item) => ({
          ...item,
          quantity: 0,
        }))
      );
    }

    if (type === "comercial") {
      setEquipment(
        commercialEquipment.map((item) => ({
          ...item,
          quantity: 0,
        }))
      );
    }

    if (type === "industrial") {
      setEquipment(
        industrialEquipment.map((item) => ({
          ...item,
          quantity: 0,
        }))
      );
    }

    if (type === "agricola") {
      setEquipment(
        agriculturalEquipment.map((item) => ({
          ...item,
          quantity: 0,
        }))
      );
    }
  }

  function updateQuantity(id: string, amount: number) {
    setEquipment((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                0,
                item.quantity + amount
              ),
            }
          : item
      )
    );
  }

  const totalEquipment = useMemo(
    () =>
      equipment.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [equipment]
  );

  /*
   * Estimativa preliminar.
   *
   * IMPORTANTE:
   * Não substitui o dimensionamento técnico.
   */
  const estimatedPower = useMemo(() => {
    let power = 3;

    const value = Number(
      consumption.replace(",", ".")
    );

    if (consumptionType === "kwh") {
      if (value <= 150) power = 3;
      else if (value <= 300) power = 5;
      else if (value <= 500) power = 8;
      else if (value <= 700) power = 10;
      else if (value <= 1000) power = 12;
      else if (value <= 1500) power = 15;
      else if (value <= 2000) power = 20;
      else power = 30;
    }

    if (consumptionType === "mt") {
      if (value <= 2500) power = 3;
      else if (value <= 5000) power = 5;
      else if (value <= 8000) power = 8;
      else if (value <= 12000) power = 10;
      else if (value <= 18000) power = 12;
      else if (value <= 25000) power = 15;
      else if (value <= 35000) power = 20;
      else power = 30;
    }

    if (totalEquipment >= 8) power += 2;
    if (totalEquipment >= 14) power += 3;

    if (priority.includes("autonomia")) {
      power += 2;
    }

    if (
      projectType === "agricola" &&
      pumpPower
    ) {
      const cv = Number(pumpPower);

      if (cv >= 5) power += 3;
      if (cv >= 10) power += 5;
      if (cv >= 15) power += 8;
    }

    return power;
  }, [
    consumption,
    consumptionType,
    totalEquipment,
    priority,
    projectType,
    pumpPower,
  ]);

  const selectedEquipment = equipment.filter(
    (item) => item.quantity > 0
  );

  function sendWhatsApp() {
    if (!name || !phone) {
      alert(
        "Por favor, indique o seu nome e contacto."
      );
      return;
    }

    if (!projectType) {
      alert(
        "Por favor, seleccione o tipo de projecto."
      );
      return;
    }

    const equipmentText =
      selectedEquipment.length > 0
        ? selectedEquipment
            .map(
              (item) =>
                `• ${item.name}: ${item.quantity}`
            )
            .join("\n")
        : "Nenhum equipamento especificado";

    const message = `
☀️ *DIMENCONAMENTO DE SISTEMA SOLAR*
*INOVAÇÕES SOLARES*

━━━━━━━━━━━━━━━━━━

👤 *DADOS DO CLIENTE*

Nome: ${name}
Contacto: ${phone}

━━━━━━━━━━━━━━━━━━

🏠 *PROJECTO*

Tipo: ${projectType}
Tipologia: ${typology || "Não informado"}
Província: ${province || "Não informado"}
Área: ${area || "Não informado"} m²

━━━━━━━━━━━━━━━━━━

⚡ *EQUIPAMENTOS*

${equipmentText}

Total de equipamentos:
${totalEquipment}

━━━━━━━━━━━━━━━━━━

🌾 *INFORMAÇÃO AGRÍCOLA*

Actividade:
${agriculturalActivity || "Não aplicável"}

Potência da bomba:
${pumpPower ? `${pumpPower} CV` : "Não aplicável"}

Horas de funcionamento:
${pumpHours || "Não aplicável"}

━━━━━━━━━━━━━━━━━━

🔌 *EDM*

${edm || "Não informado"}

━━━━━━━━━━━━━━━━━━

💰 *CONSUMO*

Tipo:
${
  consumptionType === "kwh"
    ? "Consumo mensal"
    : consumptionType === "mt"
    ? "Valor da factura"
    : "Não informado"
}

Valor:
${consumption || "Não informado"}

━━━━━━━━━━━━━━━━━━

🎯 *PRIORIDADE*

${priority || "Não informado"}

━━━━━━━━━━━━━━━━━━

☀️ *ESTIMATIVA INICIAL*

Potência solar estimada:
*${estimatedPower} kW*

⚠️ Esta é uma estimativa preliminar.
O dimensionamento técnico final deverá ser realizado pela equipa da Inovações Solares.

Gostaria de receber uma proposta personalizada.
`.trim();

    const whatsapp =
      "258841138173";

    const url =
      `https://wa.me/${whatsapp}?text=` +
      encodeURIComponent(message);

    setSubmitted(true);

    window.open(url, "_blank");
  }

 const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const optionClass =
    "rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-blue-500/60 hover:bg-blue-500/10";

  return (
    <main
      id="diagnostico-solar"
      className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">

        {/* CABEÇALHO */}
        <div className="mb-12 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            <Sun size={17} />
            Diagnóstico Solar Gratuito
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Descubra a solução solar ideal
            para o seu projecto
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-400 sm:text-lg">
            Responda às perguntas abaixo. As informações
            serão utilizadas para preparar uma estimativa
            inicial da potência adequada às suas necessidades.
          </p>

        </div>

        {/* FORMULÁRIO */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080f1c] shadow-2xl">

          {/* 1 - TIPO */}
          <section className="border-b border-white/10 p-6 sm:p-8">

            <div className="mb-6">
              <span className="text-sm font-medium text-blue-400">
                01
              </span>

              <h2 className="mt-1 text-2xl font-bold">
                Qual é o tipo do seu projecto?
              </h2>

              <p className="mt-2 text-gray-400">
                Seleccione a opção que melhor corresponde
                às suas necessidades.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {typeOptions.map((option) => {
                const Icon = option.icon;

                const active =
                  projectType === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      selectProjectType(option.id)
                    }
                    className={`rounded-2xl border p-5 text-left transition ${
                      active
                        ? "border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-500/10"
                        : "border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5"
                    }`}
                  >
                    <Icon
                      size={30}
                      className={
                        active
                          ? "text-blue-400"
                          : "text-gray-400"
                      }
                    />

                    <h3 className="mt-4 font-semibold">
                      {option.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {option.description}
                    </p>
                  </button>
                );
              })}

            </div>
          </section>

          {/* 2 - IMÓVEL */}
          <section className="border-b border-white/10 p-6 sm:p-8">

            <div className="mb-6">
              <span className="text-sm font-medium text-blue-400">
                02
              </span>

              <h2 className="mt-1 text-2xl font-bold">
                Características do projecto
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm text-gray-900">
                  Tipologia
                </label>

                <select
                  value={typology}
                  onChange={(e) =>
                    setTypology(e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">
                    Seleccione
                  </option>
                  <option value="T0">
                    T0
                  </option>
                  <option value="T1">
                    T1
                  </option>
                  <option value="T2">
                    T2
                  </option>
                  <option value="T3">
                    T3
                  </option>
                  <option value="T4">
                    T4
                  </option>
                  <option value="T5+">
                    T5+
                  </option>
                  <option value="Não se aplica">
                    Não se aplica
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Área aproximada (m²)
                </label>

                <input
                  type="number"
                  value={area}
                  onChange={(e) =>
                    setArea(e.target.value)
                  }
                  placeholder="Ex.: 250"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Província
                </label>

                <select
                  value={province}
                  onChange={(e) =>
                    setProvince(e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">
                    Seleccione
                  </option>
                  <option>Maputo</option>
                  <option>Maputo Cidade</option>
                  <option>Gaza</option>
                  <option>Inhambane</option>
                  <option>Sofala</option>
                  <option>Manica</option>
                  <option>Tete</option>
                  <option>Zambézia</option>
                  <option>Nampula</option>
                  <option>Cabo Delgado</option>
                  <option>Niassa</option>
                </select>
              </div>

            </div>
          </section>

          {/* 3 - EQUIPAMENTOS */}
          {projectType && (
            <section className="border-b border-white/10 p-6 sm:p-8">

              <div className="mb-6">
                <span className="text-sm font-medium text-blue-400">
                  03
                </span>

                <h2 className="mt-1 text-2xl font-bold">
                  Equipamentos que pretende utilizar
                </h2>

                <p className="mt-2 text-gray-400">
                  Indique a quantidade aproximada de cada
                  equipamento.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                {equipment.map((item) => (

                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                  >

                    <span className="pr-3 text-sm">
                      {item.name}
                    </span>

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            -1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="w-6 text-center font-bold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500"
                      >
                        <Plus size={15} />
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2
                  size={17}
                  className="text-blue-400"
                />

                {totalEquipment} equipamento(s)
                seleccionado(s)
              </div>

            </section>
          )}

          {/* 4 - AGRÍCOLA */}
          {projectType === "agricola" && (
            <section className="border-b border-white/10 bg-green-950/10 p-6 sm:p-8">

              <div className="mb-6 flex items-start gap-4">

                <div className="rounded-xl bg-green-500/10 p-3">
                  <Sprout
                    className="text-green-400"
                    size={28}
                  />
                </div>

                <div>
                  <span className="text-sm font-medium text-green-400">
                    PROJECTO AGRÍCOLA
                  </span>

                  <h2 className="mt-1 text-2xl font-bold">
                    Informação agrícola
                  </h2>

                  <p className="mt-2 text-gray-400">
                    Estas informações são importantes para
                    dimensionar correctamente sistemas de
                    irrigação e outras cargas agrícolas.
                  </p>
                </div>

              </div>

              <div className="mb-6">

                <label className="mb-3 block text-sm text-gray-400">
                  Qual é a actividade principal?
                </label>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  {[
                    "Irrigação",
                    "Produção agrícola",
                    "Pecuária",
                    "Avicultura",
                    "Suinicultura",
                    "Estufas",
                    "Agro-processamento",
                    "Armazenamento",
                  ].map((item) => (

                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setAgriculturalActivity(item)
                      }
                      className={`rounded-xl border p-4 text-left text-sm transition ${
                        agriculturalActivity === item
                          ? "border-green-500 bg-green-500/10"
                          : "border-white/10 bg-white/5 hover:border-green-500/50"
                      }`}
                    >
                      {item}
                    </button>

                  ))}

                </div>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Potência da bomba
                  </label>

                  <select
                    value={pumpPower}
                    onChange={(e) =>
                      setPumpPower(e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Seleccione
                    </option>
                    <option value="1">
                      1 CV
                    </option>
                    <option value="2">
                      2 CV
                    </option>
                    <option value="3">
                      3 CV
                    </option>
                    <option value="5">
                      5 CV
                    </option>
                    <option value="7.5">
                      7,5 CV
                    </option>
                    <option value="10">
                      10 CV
                    </option>
                    <option value="15">
                      15 CV
                    </option>
                    <option value="20">
                      20 CV
                    </option>
                    <option value="25">
                      25 CV ou mais
                    </option>
                    <option value="nao-sei">
                      Não sei
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Horas de funcionamento por dia
                  </label>

                  <select
                    value={pumpHours}
                    onChange={(e) =>
                      setPumpHours(e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Seleccione
                    </option>
                    <option>
                      Menos de 2 horas
                    </option>
                    <option>
                      2–4 horas
                    </option>
                    <option>
                      4–6 horas
                    </option>
                    <option>
                      6–8 horas
                    </option>
                    <option>
                      Mais de 8 horas
                    </option>
                  </select>
                </div>

              </div>

            </section>
          )}

          {/* 5 - EDM */}
          <section className="border-b border-white/10 p-6 sm:p-8">

            <div className="mb-6">
              <span className="text-sm font-medium text-blue-400">
                04
              </span>

              <h2 className="mt-1 text-2xl font-bold">
                Qual é a situação da EDM?
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              {[
                "Sim, tenho ligação à EDM",
                "Não tenho ligação à EDM",
                "Tenho ligação, mas a energia é instável",
                "Quero reduzir a dependência da EDM",
              ].map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() => setEdm(item)}
                  className={`${optionClass} ${
                    edm === item
                      ? "border-blue-500 bg-blue-500/15"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <Zap
                      size={20}
                      className={
                        edm === item
                          ? "text-blue-400"
                          : "text-gray-500"
                      }
                    />

                    {item}

                  </div>
                </button>

              ))}

            </div>

          </section>

          {/* 6 - CONSUMO */}
          <section className="border-b border-white/10 p-6 sm:p-8">

            <div className="mb-6">
              <span className="text-sm font-medium text-blue-400">
                05
              </span>

              <h2 className="mt-1 text-2xl font-bold">
                Qual é o seu consumo médio?
              </h2>

              <p className="mt-2 text-gray-400">
                Pode indicar o consumo em kWh ou o valor
                aproximado da factura mensal.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  setConsumptionType("kwh")
                }
                className={`${optionClass} ${
                  consumptionType === "kwh"
                    ? "border-blue-500 bg-blue-500/15"
                    : ""
                }`}
              >
                Consumo em kWh/mês
              </button>

              <button
                type="button"
                onClick={() =>
                  setConsumptionType("mt")
                }
                className={`${optionClass} ${
                  consumptionType === "mt"
                    ? "border-blue-500 bg-blue-500/15"
                    : ""
                }`}
              >
                Valor da factura em Mt
              </button>

            </div>

            {consumptionType && (
              <div className="mt-5">

                <input
                  type="number"
                  value={consumption}
                  onChange={(e) =>
                    setConsumption(e.target.value)
                  }
                  placeholder={
                    consumptionType === "kwh"
                      ? "Ex.: 500"
                      : "Ex.: 7500"
                  }
                  className={inputClass}
                />

              </div>
            )}

          </section>

          {/* 7 - PRIORIDADE */}
          <section className="border-b border-white/10 p-6 sm:p-8">

            <div className="mb-6">
              <span className="text-sm font-medium text-blue-400">
                06
              </span>

              <h2 className="mt-1 text-2xl font-bold">
                Qual é a sua principal prioridade?
              </h2>

              <p className="mt-2 text-gray-400">
                Seleccione a opção que melhor representa o seu principal
                objectivo com a energia solar.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {[
                {
                  id: "reducao-factura",
                  text: "Reduzir a factura da EDM",
                  icon: "💰",
                },
                {
                  id: "cortes",
                  text: "Ter energia durante cortes",
                  icon: "🔋",
                },
                {
                  id: "autonomia",
                  text: "Ter maior autonomia energética",
                  icon: "⚡",
                },
                {
                  id: "bombas",
                  text: "Alimentar bombas de água",
                  icon: "💧",
                },
                {
                  id: "irrigacao",
                  text: "Irrigação agrícola",
                  icon: "🌱",
                },
                {
                  id: "gerador",
                  text: "Substituir gerador",
                  icon: "🔌",
                },
                {
                  id: "negocio",
                  text: "Proteger o meu negócio",
                  icon: "🏢",
                },
                {
                  id: "custos",
                  text: "Reduzir custos operacionais",
                  icon: "📉",
                },
                {
                  id: "sustentabilidade",
                  text: "Energia limpa e sustentável",
                  icon: "☀️",
                },
              ].map((item) => {

                const isSelected = priority === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPriority(item.id);
                    }}
                    className={`
                      relative flex min-h-[90px] items-center
                      rounded-xl border p-4 text-left
                      transition-all duration-200
                      cursor-pointer
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30"
                          : "border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/10"
                      }
                    `}
                  >

                    {/* Indicador de selecção */}
                    <div
                      className={`
                        mr-4 flex h-7 w-7 flex-shrink-0
                        items-center justify-center
                        rounded-full border-2
                        transition-all
                        ${
                          isSelected
                            ? "border-blue-400 bg-blue-500 text-white"
                            : "border-gray-600 bg-transparent"
                        }
                      `}
                    >
                      {isSelected && (
                        <span className="text-sm font-bold">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Ícone */}
                    <span className="mr-3 text-2xl">
                      {item.icon}
                    </span>

                    {/* Texto */}
                    <span
                      className={`
                        text-sm font-medium
                        ${
                          isSelected
                            ? "text-white"
                            : "text-gray-300"
                        }
                      `}
                    >
                      {item.text}
                    </span>

                  </button>
                );
              })}

            </div>

            {/* Opção seleccionada */}
            {priority && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
                <CheckCircle2 size={18} />

                <span>
                  Prioridade seleccionada:{" "}
                  <strong className="text-white">
                    {
                      {
                        "reducao-factura":
                          "Reduzir a factura da EDM",

                        cortes:
                          "Ter energia durante cortes",

                        autonomia:
                          "Ter maior autonomia energética",

                        bombas:
                          "Alimentar bombas de água",

                        irrigacao:
                          "Irrigação agrícola",

                        gerador:
                          "Substituir gerador",

                        negocio:
                          "Proteger o meu negócio",

                        custos:
                          "Reduzir custos operacionais",

                        sustentabilidade:
                          "Energia limpa e sustentável",
                      }[priority]
                    }
                  </strong>
                </span>
              </div>
            )}

          </section>

          {/* 8 - CONTACTO */}
          <section className="p-6 sm:p-8">

            <div className="mb-6">
              <span className="text-sm font-medium text-blue-400">
                07
              </span>

              <h2 className="mt-1 text-2xl font-bold">
                Como podemos entrar em contacto consigo?
              </h2>

              <p className="mt-2 text-gray-400">
                Enviaremos o seu diagnóstico directamente
                para a nossa equipa comercial.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Nome
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Seu nome"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  WhatsApp / Telefone
                </label>

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Ex.: 84 123 4567"
                  className={inputClass}
                />
              </div>

            </div>

            {/* RESULTADO */}
            <div className="mt-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <BatteryCharging size={18} />
                    Estimativa preliminar
                  </div>

                  <p className="mt-2 text-gray-400">
                    Com base nas informações fornecidas,
                    a potência inicial estimada é:
                  </p>

                </div>

                <div className="text-4xl font-bold text-blue-400">
                  {estimatedPower} kW
                </div>

              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Esta estimativa não substitui o
                dimensionamento técnico. A equipa da
                Inovações Solares deverá analisar as cargas,
                horários de funcionamento, potência de
                arranque, baterias, painéis e demais
                condições do projecto.
              </p>

            </div>

            {/* BOTÃO WHATSAPP */}
            <button
              type="button"
              onClick={sendWhatsApp}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-green-900/20 transition hover:bg-green-500"
            >

              <MessageCircle size={25} />

              Enviar diagnóstico pelo WhatsApp

            </button>

            {submitted && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-400">
                <CheckCircle2 size={18} />

                Diagnóstico preparado para envio.
              </div>
            )}

          </section>

        </div>

        {/* RODAPÉ DA PÁGINA */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Inovações Solares — Soluções de Energia Solar
          </p>

          <p className="mt-1">
            O dimensionamento final será realizado pela
            nossa equipa técnica.
          </p>
        </div>

      </div>
    </main>
  );
}