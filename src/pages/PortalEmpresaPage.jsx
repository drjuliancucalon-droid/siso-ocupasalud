// src/pages/PortalEmpresaPage.jsx — Company Portal
// Public route: shows company dashboard and worker list
// T-07: Completar Portal Empresa - Excel export
import React, { useState, useMemo } from 'react';
import { CompanyPortal } from '../modules/companies/components/CompanyPortal';
import { useBackendData } from '../hooks/useBackendData';
import { Building2, Loader2, Download, ArrowLeft, Search } from 'lucide-react';

export default function PortalEmpresaPage() {
  const { data: companies, loading: loadingCompanies } = useBackendData('/data/companies', 'siso_companies', 'companies');
  const { data: patients, loading: loadingPatients } = useBackendData('/data/patients', 'siso_db_patients', 'patients');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [search, setSearch] = useState('');

  const loading = loadingCompanies || loadingPatients;

  // Filter companies by search
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    if (!search.trim()) return companies;
    const q = search.toLowerCase();
    return companies.filter(c =>
      (c.razonSocial || c.nombre || '').toLowerCase().includes(q) ||
      (c.nit || '').includes(q)
    );
  }, [companies, search]);

  // Export all companies to CSV
  const handleExportExcel = () => {
    if (!companies || companies.length === 0) { alert('No hay empresas para exportar'); return; }
    const headers = 'Nombre,NIT,Actividad,E-mail,Teléfono,Dirección,ARL,Employees\n';
    const rows = companies.map(c =>
      `"${(c.razonSocial || c.nombre || '').replace(/"/g, '""')}","${c.nit || ''}","${c.actividadeconomica || ''}","${c.email || ''}","${c.telefono || ''}","${c.direccion || ''}","${c.arl || ''}","${c.empleados || 0}"`
    ).join('\n');
    const csv = '\uFEFF' + headers + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `empresas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCompanyList = (companyPatients, companyName) => {
    if (!companyPatients || companyPatients.length === 0) { alert('No hay trabajadores para exportar'); return; }
    const headers = 'Nombre,Documento,Cargo,Fecha Examen,Concepto\n';
    const rows = companyPatients.map(p =>
      `"${(p.nombres || '').replace(/"/g, '""')}","${p.docTipo || 'CC'} ${p.docNumero || ''}","${p.cargo || ''}","${p.fechaExamen || ''}","${p.conceptoAptitud || 'Pendiente'}"`
    ).join('\n');
    const csv = '\uFEFF' + headers + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trabajadores_${(companyName || 'empresa').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // If a company is selected, show its portal
  if (selectedCompanyId) {
    const selectedCompany = companies?.find(c => c.id === selectedCompanyId) || null;
    if (!selectedCompany) {
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <button onClick={() => setSelectedCompanyId(null)} className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 mb-4">
            <ArrowLeft className="w-4 h-4" /> Volver a empresas
          </button>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <Building2 className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <p className="text-yellow-800 font-bold">Empresa no encontrada</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <button onClick={() => setSelectedCompanyId(null)} className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 mb-4">
          <ArrowLeft className="w-4 h-4" /> Volver a empresas
        </button>
        <CompanyPortal
          company={selectedCompany}
          patients={patients || []}
          onViewCertificate={(p) => {
            window.open(`/certificado/${p.docNumero || p.id}`, '_blank');
          }}
          onExportList={handleExportCompanyList}
          onBack={() => setSelectedCompanyId(null)}
        />
      </div>
    );
  }

  // Company selector view
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-800">Portal Empresa</h1>
        </div>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700"
        >
          <Download className="w-4 h-4" />
          Exportar Excel
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar empresa por nombre o NIT..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none"
        />
      </div>

      {/* Company list */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No se encontraron empresas</p>
          {search && <p className="text-gray-400 text-sm mt-1">Intente con otro término de búsqueda</p>}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => {
            const companyPatients = (patients || []).filter(p => p.empresaId === company.id);
            const aptos = companyPatients.filter(p =>
              (p.conceptoAptitud || '').toLowerCase().includes('apto') &&
              !(p.conceptoAptitud || '').toLowerCase().includes('no apto')
            ).length;

            return (
              <div
                key={company.id}
                onClick={() => setSelectedCompanyId(company.id)}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2">
                      {company.razonSocial || company.nombre || 'Empresa sin nombre'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">NIT: {company.nit || 'N/A'}</p>
                  </div>
                  <Building2 className="w-5 h-5 text-orange-400 flex-shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-black text-emerald-700">{companyPatients.length}</p>
                    <p className="text-emerald-600">Evaluados</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-black text-blue-700">{aptos}</p>
                    <p className="text-blue-600">Aptos</p>
                  </div>
                </div>

                {company.actividadeconomica && (
                  <p className="text-[10px] text-gray-400 mt-3 truncate">
                    {company.actividadeconomica}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legal notice */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-3 text-[10px] text-blue-700">
        <p className="font-black">🔒 Información confidencial - Res. 1843/2025 Art. 12</p>
        <p className="mt-0.5">
          Solo se muestra el concepto de aptitud. La historia clínica completa es de acceso
          exclusivo del médico evaluador (Ley 23/1981, Res. 1995/1999).
        </p>
      </div>
    </div>
  );
}