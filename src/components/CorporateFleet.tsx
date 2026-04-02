import React from "react";
import {motion} from "motion/react";
import {WHATSAPP_NUMBER} from "../constants";
import {
  Truck,
  HardHat,
  FileText,
  Users,
  ShieldCheck,
  Wrench,
  ArrowRight,
  Fuel,
} from "lucide-react";

const SERVICES = [
  {
    icon: Truck,
    title: "Camionetas 4×4 para Mineras y Petroleras",
    description:
      "Flota de pickups de alta gama preparadas para terrenos exigentes: Toyota Hilux, Ford Ranger, Mitsubishi L200 y más. Disponibles con conductor o sin él.",
    tags: ["Hilux", "Ranger", "L200", "Terrain"],
  },
  {
    icon: HardHat,
    title: "Apoyo Logístico en Campo",
    description:
      "Vehículos equipados con jaula antivuelco, auxilio mecánico en ruta, GPS en tiempo real y comunicación satelital para operaciones remotas.",
    tags: ["GPS", "Satélite", "Auxilio", "4WD"],
  },
  {
    icon: Users,
    title: "Traslado de Personal Corporativo",
    description:
      "Soluciones de transporte ejecutivo y traslado de equipos de trabajo. Vans, SUVs y sedanes de flota para empresas de cualquier tamaño.",
    tags: ["Ejecutivo", "Van", "SUV", "Grupos"],
  },
  {
    icon: FileText,
    title: "Contratos de Largo Plazo",
    description:
      "Acuerdos mensuales o anuales con precios diferenciados, mantenimiento incluido y reposición de unidad garantizada ante cualquier eventualidad.",
    tags: ["Mensual", "Anual", "Mantenimiento", "Repuesto"],
  },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    text: "Seguro con cobertura total para actividades industriales",
  },
  {
    icon: Wrench,
    text: "Mantenimiento preventivo y correctivo sin costo adicional",
  },
  {icon: Fuel, text: "Opciones con combustible incluido según contrato"},
  {
    icon: FileText,
    text: "Facturación centralizada y reportes de flota en línea",
  },
];

export default function CorporateFleet() {
  return (
    <section
      id="corporativo"
      className="py-24 bg-brand-gray-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{opacity: 0, y: 10}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Soluciones Empresariales
          </motion.span>
          <motion.h2
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.05}}
            className="text-3xl md:text-4xl font-display font-bold text-brand-navy mb-4">
            Alquiler de Flota{" "}
            <span className="text-brand-orange">Corporativa</span>
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.1}}
            className="text-gray-500 max-w-2xl mx-auto text-lg">
            Equipamos a mineras, petroleras y empresas con vehículos de alto
            rendimiento, listos para operar en los entornos más exigentes de la
            Patagonia y los Andes.
          </motion.p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5, delay: index * 0.1}}
                className="bg-white rounded-2xl p-8 card-shadow border border-gray-100 hover:border-brand-orange/30 transition-colors group">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-14 h-14 bg-brand-navy/5 rounded-xl flex items-center justify-center group-hover:bg-brand-orange transition-colors">
                    <Icon
                      size={26}
                      className="text-brand-navy group-hover:text-white transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-brand-navy mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Strip */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5}}
          className="bg-brand-navy rounded-2xl px-8 py-10 mb-12">
          <p className="text-center text-white/60 text-sm font-semibold uppercase tracking-widest mb-8">
            Todo incluido en tu contrato corporativo
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4">
                  <div className="shrink-0 w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                    <Icon
                      size={20}
                      className="text-brand-orange"
                    />
                  </div>
                  <p className="text-white/80 text-sm leading-snug">
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 0.1}}
          className="text-center">
          <p className="text-gray-500 mb-6">
            ¿Necesitás una solución a medida para tu empresa?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#contacto"
              className="btn-primary inline-flex items-center justify-center gap-2 px-10 py-4 text-base">
              Solicitar Cotización Corporativa
              <ArrowRight size={18} />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, me interesa el alquiler corporativo")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center justify-center gap-2 px-10 py-4 text-base">
              Hablar por WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
