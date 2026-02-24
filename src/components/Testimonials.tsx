import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

export default function Testimonials() {
  return (
    <section className="py-24 bg-brand-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-navy mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            La confianza de quienes ya recorrieron los Andes con nosotros es nuestro mayor orgullo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl card-shadow relative"
            >
              <Quote className="absolute top-6 right-8 text-brand-orange/10" size={48} />
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.rating ? 'text-brand-orange fill-brand-orange' : 'text-gray-300'}
                  />
                ))}
              </div>
              
              <p className="text-gray-600 italic mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <span className="font-bold text-brand-navy">{testimonial.name}</span>
                <span className="text-xs text-gray-400">{testimonial.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
