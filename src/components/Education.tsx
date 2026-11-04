/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EDUCATION_HISTORY } from '../data/profileData';

export const Education: React.FC = () => {
  return (
    <section id="pendidikan" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-600 font-bold text-sm uppercase tracking-wider bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100">
            Landasan Keilmuan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            Riwayat Pendidikan
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-brand-500 to-sunshine-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EDUCATION_HISTORY.map((edu, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-warmbg border border-emerald-100 hover:border-brand-500 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-2xl ${edu.iconBgClass} flex items-center justify-center text-xl font-bold mb-6`}
                >
                  <i className={`fa-solid ${edu.iconClass}`}></i>
                </div>
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                  {edu.degree}
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                  {edu.institution}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {edu.subname}
                </p>
                <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                  {edu.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500 font-semibold">
                <span>
                  <i className="fa-regular fa-calendar mr-1"></i> {edu.period}
                </span>
                <span className={`${edu.badgeBgClass} px-2.5 py-1 rounded-md`}>
                  {edu.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
