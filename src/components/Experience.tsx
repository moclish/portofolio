/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EXPERIENCES } from '../data/profileData';

export const Experience: React.FC = () => {
  return (
    <section id="pengalaman" className="py-20 bg-warmbg relative scroll-mt-[5px] border-t border-emerald-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-600 font-bold text-sm uppercase tracking-wider bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100">
            Jejak Pengabdian
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            Pengalaman Profesional
          </h2>
          <p className="text-gray-600 mt-2">
            Perjalanan profesional dalam memajukan kualitas pendidikan madrasah
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto relative">
          {/* Soft Gradient Vertical Timeline Line (Replacing harsh black line) */}
          <div
            className="absolute left-[15px] sm:left-[19px] top-6 bottom-6 w-[3px] bg-gradient-to-b from-brand-600 via-emerald-400 to-sunshine-400/40 rounded-full shadow-xs"
            aria-hidden="true"
          ></div>

          <div className="space-y-10 sm:space-y-12">
            {EXPERIENCES.map((exp, index) => {
              const isFirst = index === 0;
              const nodeBg = isFirst ? 'bg-brand-600' : 'bg-sunshine-500';
              const ringColor = isFirst
                ? 'ring-brand-100 group-hover:ring-brand-200'
                : 'ring-amber-100 group-hover:ring-amber-200';
              const badgeBg = isFirst
                ? 'bg-brand-100 text-brand-800'
                : 'bg-amber-100 text-amber-800';
              const subtitleColor = isFirst ? 'text-brand-700' : 'text-amber-700';

              return (
                <div key={index} className="relative pl-10 sm:pl-14 group">
                  {/* Glowing Timeline Marker Dot */}
                  <div
                    className={`absolute left-0 sm:left-1 top-2.5 w-8 h-8 rounded-full bg-white ring-4 ${ringColor} shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-115 z-10`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${nodeBg} transition-transform group-hover:scale-110 shadow-xs`}
                    ></div>
                  </div>

                  {/* Card Content */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-100/70 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span
                        className={`px-3.5 py-1 rounded-full ${badgeBg} text-xs font-bold flex items-center gap-1.5 shadow-2xs`}
                      >
                        <i className="fa-regular fa-calendar"></i> {exp.period}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {exp.institution}
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-brand-700 transition-colors">
                      {exp.role}
                    </h3>
                    <p className={`${subtitleColor} font-semibold text-sm mb-4`}>
                      {exp.subtitle}
                    </p>

                    <ul className="space-y-2.5 text-gray-600 text-sm">
                      {exp.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <i
                            className={`fa-solid fa-circle-check ${exp.bulletColorClass} mt-1 text-sm flex-shrink-0`}
                          ></i>
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
