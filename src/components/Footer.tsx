import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="bg-brand-navy text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <span className="text-2xl font-display font-bold tracking-tight">
              ANDES <span className="text-brand-orange">WAY</span>
            </span>
            <p className="text-gray-400 text-sm leading-relaxed">
              Alquiler de autos premium en la región andina. Flota propia,
              atención personalizada y la mejor experiencia de viaje.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-brand-orange transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#vehiculos"
                  className="hover:text-brand-orange transition-colors">
                  Nuestra Flota
                </a>
              </li>
              <li>
                <a
                  href="#nosotros"
                  className="hover:text-brand-orange transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-orange transition-colors">
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contacto</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="text-brand-orange"
                />
                <a
                  href="tel:+5492617608355"
                  className="hover:text-white transition-colors">
                  +54 9 2617 60-8355
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="text-brand-orange"
                />
                info@andesway.com
              </li>
              <li className="flex items-center gap-3">
                <MapPin
                  size={18}
                  className="text-brand-orange"
                />
                Mendoza, Argentina
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div>
            <h4 className="text-lg font-bold mb-6">Atención Inmediata</h4>
            <p className="text-gray-400 text-sm mb-6">
              ¿Tenés dudas? Escribinos por WhatsApp y te asesoramos en el
              momento.
            </p>
            <a
              href="https://wa.me/5492617608355"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
              <MessageCircle size={20} />
              +54 9 2617 60-8355
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
          <p>
            © {new Date().getFullYear()} Andes Way – Rent a Car. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
