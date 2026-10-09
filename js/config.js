/**
 * Studio44 - Zentrale Konfiguration & Datenmodell
 * Enthält alle Medien-URLs (Unsplash), Shop-Stammdaten, Services, Barbers, Galerie & Personas.
 */

const CONFIG = {
  shop: {
    name: 'Studio44',
    badge: 'ST44 BARBERSHOP',
    claim: 'Fresh Cuts. Dein Style.',
    subline: 'Der urbane Spot für kompromisslose Fades, scharfe Konturen und Streetwear-Vibes. Kein Smalltalk-Zwang, nur pure Präzision.',
    phone: '+49 176 4400 4400',
    phoneFormatted: '0176 4400 4400',
    address: {
      street: 'Kaiserstraße 44',
      zip: '60329',
      city: 'Frankfurt am Main',
      mapsQuery: 'Kaiserstraße 44, 60329 Frankfurt am Main',
      mapsUrl: 'https://maps.google.com/?q=Kaiserstra%C3%9Fe+44,+60329+Frankfurt+am+Main'
    },
    social: {
      instagram: 'https://instagram.com/studio44_barber',
      instagramHandle: '@studio44_barber',
      whatsapp: 'https://wa.me/4917644004400?text=Hi%20Studio44%2C%20ich%20habe%20eine%20Frage%20zu%20einem%20Termin'
    },
    openingHours: [
      { day: 1, name: 'Montag', open: '10:00', close: '20:00', closed: false },
      { day: 2, name: 'Dienstag', open: '10:00', close: '20:00', closed: false },
      { day: 3, name: 'Mittwoch', open: '10:00', close: '20:00', closed: false },
      { day: 4, name: 'Donnerstag', open: '10:00', close: '20:00', closed: false },
      { day: 5, name: 'Freitag', open: '10:00', close: '20:30', closed: false },
      { day: 6, name: 'Samstag', open: '09:30', close: '19:00', closed: false },
      { day: 0, name: 'Sonntag', open: null, close: null, closed: true }
    ],
    timeSlotIntervalMinutes: 30,
    media: {
      hero: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80',
      interior: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80'
    }
  },

  services: [
    {
      id: 'haircut',
      title: 'Haarschnitt',
      price: 20,
      duration: 30,
      badge: 'Bestseller',
      description: 'Präziser Fade (Low, Mid, High, Taper Fade) oder klassischer Cut inklusive Nackenrasur und Finish-Styling.',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      features: ['Skin Fade / Taper Fade', 'Scherenschnitt Deckhaar', 'Nacken ausrasieren', 'Streetwear Finish Wax/Powder']
    },
    {
      id: 'beard',
      title: 'Bart trimmen & Konturen',
      price: 7,
      duration: 15,
      badge: 'Essential',
      description: 'Exakte Konturen mit Rasiermesser, Bart-Trimm auf Wunschlänge, Heißtuch & feinstes Bartöl.',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
      features: ['Razor-Sharp Konturen', 'Längenangleich & Trimm', 'Hot Towel Treatment', 'Premium Bartöl Finish']
    },
    {
      id: 'wash_style',
      title: 'Haare waschen & Styling',
      price: 5,
      duration: 15,
      badge: 'Upgrade',
      description: 'Erfrischende Haarwäsche mit Kopfmassage, Föhnen in Form und High-End Matte-Clay oder Texture-Powder.',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
      features: ['Deep Cleansing Wash', 'Revitalisierende Kopfmassage', 'Volume Blow-Dry', 'Matte Clay / Powder Styling']
    }
  ],

  barbers: [
    {
      id: 'zana',
      name: 'Zana',
      nickname: 'The Precision Master',
      role: 'Master Barber & Founder',
      specialization: 'Textured Crop & Razor Sharp Skin Fades',
      experience: '8 Jahre Erfahrung',
      rating: 4.98,
      reviewCount: 342,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      bio: 'Gründer von Studio44. Perfektionist an der Klinge mit Fokus auf Millimeter-Fades und nahtlose Übergänge für den anspruchsvollsten Streetwear-Look.',
      cuts: [
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 'tarik',
      name: 'Tarik',
      nickname: 'Fade Specialist',
      role: 'Senior Barber',
      specialization: 'Mid & Drop Fades, Fluffy Edges & Spiky Crops',
      experience: '5 Jahre Erfahrung',
      rating: 4.95,
      reviewCount: 289,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bio: 'Kennt jeden aktuellen TikTok- und Streetstyle-Trend auswendig. Tarik bringt dir das Maximum an Textur ins Deckhaar und sorgt für Fades, die tagelang frisch bleiben.',
      cuts: [
        'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 'akin',
      name: 'Akin',
      nickname: 'Beard Alchemist',
      role: 'Senior Stylist & Beard Artist',
      specialization: 'Beard Sculpting & Sharp Razor Lines',
      experience: '6 Jahre Erfahrung',
      rating: 4.97,
      reviewCount: 260,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      bio: 'Sein Markenzeichen: Bärte mit geometrischer Schärfe und fließendem Übergang in die Koteletten. Heißtuch-Profi für absolute Tiefenentspannung.',
      cuts: [
        'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 'isa',
      name: 'Isa',
      nickname: 'Classic & Modern Maestro',
      role: 'Barber & Style Consultant',
      specialization: 'Taper Fade, Modern Slick Back & Scissor Cuts',
      experience: '4 Jahre Erfahrung',
      rating: 4.94,
      reviewCount: 215,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      bio: 'Verbindet Old-School Eleganz mit moderner Ästhetik. Favorit unserer Young Professionals für gepflegte Schnitte mit natürlichem Fall und scharfen Nackenkanten.',
      cuts: [
        'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1593702295094-ada7554100c3?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 'mohammed',
      name: 'Mohammed',
      nickname: 'Buzz & Burst Fade King',
      role: 'Barber & Graphic Cut Specialist',
      specialization: 'Buzz Cuts, Burst Fades & Hair Tattoo Lines',
      experience: '5 Jahre Erfahrung',
      rating: 4.96,
      reviewCount: 274,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
      bio: 'Kreativ, detailverliebt und blitzschnell. Mohammed liebt markante Schnitte, klare Kanten und individuelle Haarlinien-Akzente mit maximaler Frische.',
      cuts: [
        'https://images.unsplash.com/photo-1593702295094-ada7554100c3?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80'
      ]
    }
  ],

  gallery: [
    {
      id: 1,
      title: 'Flawless Mid-Skin Fade',
      category: 'Fade',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80',
      barber: 'Zana',
      desc: 'Zero-Guard Übergang mit samtiger Schattierung und Matt-Paste Finish.'
    },
    {
      id: 2,
      title: 'Textured Crop Top',
      category: 'Cut & Style',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80',
      barber: 'Tarik',
      desc: 'Urbaner Streetwear-Schnitt mit definierter Stirnkante und Texturpulver.'
    },
    {
      id: 3,
      title: 'Beard Fade & Razor Contour',
      category: 'Bart',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80',
      barber: 'Akin',
      desc: 'Millimetergenaue Wangenlinie mit traditioneller Rasierklinge und Heißtuch.'
    },
    {
      id: 4,
      title: 'Signature Precision Tools',
      category: 'Studio',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
      barber: 'Studio44',
      desc: 'Nur High-End Maschinen von Wahl, Babyliss Pro und handgeschmiedete Scheren.'
    },
    {
      id: 5,
      title: 'Clean Low Taper Fade',
      category: 'Fade',
      image: 'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=1200&q=80',
      barber: 'Isa',
      desc: 'Subtiler Nacken- und Koteletten-Fade für den idealen Business-Look.'
    },
    {
      id: 6,
      title: 'Matte Clay Finish & Texture',
      category: 'Styling',
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1200&q=80',
      barber: 'Tarik',
      desc: 'Natürlicher Glanz-freier Halt für voluminöses Deckhaar über den ganzen Tag.'
    },
    {
      id: 7,
      title: 'Sharp Geometric Buzz Cut',
      category: 'Cut & Style',
      image: 'https://images.unsplash.com/photo-1593702295094-ada7554100c3?auto=format&fit=crop&w=1200&q=80',
      barber: 'Mohammed',
      desc: 'Ultrakurzer Schnitt mit laserpräzisen Kanten an Schläfen und Nacken.'
    },
    {
      id: 8,
      title: 'The Lounge & Cutting Stations',
      category: 'Studio',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
      barber: 'Studio44',
      desc: 'Urbaner Dark-Mode Salon mit Beats, kalten Drinks und entspanntem Vibe.'
    }
  ],

  reviews: [
    {
      id: 1,
      name: 'Dennis K.',
      age: 21,
      handle: '@dennis_k99',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      date: 'Vor 2 Tagen',
      barber: 'Zana',
      service: 'Haarschnitt + Bart',
      text: 'Bester Fade in ganz Frankfurt, no cap! Zana nimmt sich Zeit und die Kanten sind so scharf, dass man sich spiegeln kann. Online gebucht in 40 Sekunden, direkt dran gewesen.'
    },
    {
      id: 2,
      name: 'Leon M.',
      age: 25,
      handle: '@leon_marx',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      date: 'Vor 5 Tagen',
      barber: 'Tarik',
      service: 'Haarschnitt',
      text: 'Der Vibe im Laden ist einmalig. Beats laufen, Dosen-Drink aufs Haus und Tarik weiß genau, wie der Crop fallen muss. Nie wieder woanders!'
    },
    {
      id: 3,
      name: 'Maximilian B.',
      age: 28,
      handle: '@max_b_consulting',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      date: 'Vor 1 Woche',
      barber: 'Isa',
      service: 'Haarschnitt + Bart + Styling',
      text: 'Pünktlich auf die Minute, extrem professionell. Als Marketing-Lead brauche ich einen Schnitt, der sowohl im Zoom-Call als auch am Wochenende überzeugt. Studio44 liefert jedes Mal ab.'
    },
    {
      id: 4,
      name: 'Can Y.',
      age: 18,
      handle: '@can.yildiz',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      stars: 5,
      date: 'Vor 2 Wochen',
      barber: 'Akin',
      service: 'Bart trimmen & Konturen',
      text: 'Preise sind übertrieben fair für diese Qualität (27€ für Kombi ist geschenkt). Bartkonturen halten brutal lange. 10/10 Weiterempfehlung!'
    }
  ],

  personas: [
    {
      id: 'kevin',
      name: 'Kevin',
      age: 19,
      role: 'Der Trendsetter / Schüler & Content Creator',
      tag: 'Gen Z / TikTok & Insta',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      goal: 'Immer den frischesten Mid-Fade für Party & Instagram haben, spontan und unkompliziert per Smartphone auf der Website buchen.',
      empathyMap: {
        thinksFeels: '"Mein Schnitt muss 100% sitzen, sonst geht der Tag nicht fit."',
        sees: 'TikTok-Trends, Streetwear-Style, Fades von Promis und Creatorn.',
        hears: 'Hip-Hop, Deutschrap, Freundeskreis redet ständig über die besten Barber in der City.',
        pains: 'Telefonieren nervt; lange Wartezeiten trotz Termin; veraltete, unübersichtliche Webseiten ohne Live-Verfügbarkeit.',
        gains: 'Schnelle Online-Buchung in 60 Sekunden direkt auf dem Handy, cooler Vibe im Laden, perfekter Instagram-Look.'
      }
    },
    {
      id: 'alex',
      name: 'Alex',
      age: 27,
      role: 'Der Young Professional / Marketing Specialist',
      tag: 'Business & Weekend',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      goal: 'Gepflegtes Erscheinungsbild für Kundentermine und Wochenend-Events, verlässlicher Stamm-Barber ohne Verzögerung.',
      empathyMap: {
        thinksFeels: '"Ich brauche Effizienz. Der Termin muss pünktlich stehen, ohne ewiges Warten."',
        sees: 'Ästhetische Instagram-Feeds, cleanes Webdesign, Business-Casual Styles, moderne Agenturen.',
        hears: 'Podcasts über Karriere & Lifestyle, Empfehlungen von Kollegen und Kunden.',
        pains: 'Keine Transparenz bei Preisen; unübersichtliche Webseiten; unflexible Absagen.',
        gains: 'Kombi-Pakete (Haar + Bart) auf einen Klick, einfaches Verschieben/Stornieren online, fester Stamm-Barber.'
      }
    },
    {
      id: 'malik',
      name: 'Malik',
      age: 16,
      role: 'Der Gen-Z Student / Schüler',
      tag: 'Budget & Freshness',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      goal: 'Guter Style zum fairen Preis, wöchentliches Nachschneiden der Konturen ohne komplizierten Buchungsprozess.',
      empathyMap: {
        thinksFeels: '"Ich will nicht viel Geld ausgeben, aber trotzdem immer frisch aussehen."',
        sees: 'YouTube Shorts, Sneaker-Drops, Streetwear-Trends auf den Straßen und Schulhöfen.',
        hears: 'Seine Crew, die regelmäßig zum gleichen Friseur geht und über Preise spricht.',
        pains: 'Unübersichtliche Preise, versteckte Kosten, veraltete Friseur-Websites ohne direkte Online-Buchung.',
        gains: 'Transparente Preisanzeige in Echtzeit, kinderleichte Bedienung der Website komplett mit dem Daumen.'
      }
    }
  ]
};

// Bereitstellung im globalen Scope für modulare Script-Dateien
window.STUDIO44_CONFIG = CONFIG;
