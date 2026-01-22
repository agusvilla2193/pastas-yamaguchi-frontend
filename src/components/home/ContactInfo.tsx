export default function ContactInfo() {
    return (
        <section className="py-24 bg-neutral-900/20 border-t border-neutral-800/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Encuéntranos en el <span className="text-red-600">Dojo</span></h2>
                    <div className="h-1 w-20 bg-red-600 mx-auto mt-4"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* DIRECCIÓN */}
                    <div className="group p-10 rounded-[2.5rem] bg-neutral-950 border border-neutral-800 hover:border-red-600/50 transition-all duration-500">
                        <div className="text-red-600 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-center mb-4">Dirección</h3>
                        <p className="text-neutral-500 text-sm text-center leading-relaxed font-medium tracking-tight">Avenida Intendente Adolfo Arnoldi 2062,<br />Buenos Aires, Argentina</p>
                    </div>

                    {/* HORARIOS */}
                    <div className="group p-10 rounded-[2.5rem] bg-neutral-950 border border-neutral-800 hover:border-red-600/50 transition-all duration-500">
                        <div className="text-red-600 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-center mb-4">Horarios</h3>
                        <p className="text-neutral-500 text-sm text-center leading-relaxed font-medium tracking-tight">Martes a Domingo<br />11:00 AM — 22:30 PM</p>
                    </div>

                    {/* CONTACTO */}
                    <div className="group p-10 rounded-[2.5rem] bg-neutral-950 border border-neutral-800 hover:border-red-600/50 transition-all duration-500">
                        <div className="text-red-600 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-center mb-4">Contacto</h3>
                        <p className="text-neutral-500 text-sm text-center leading-relaxed font-medium tracking-tight">WhatsApp: +54 9 11 5118 9730<br />hola@yamaguchipastas.com</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
