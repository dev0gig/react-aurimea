import React from 'react';

export interface Card {
  id: number;
  title: string;
  number: string;
  holder: string;
  expiry: string;
  color: string;
}

export const cards: Card[] = [
    {
        id: 1,
        title: "Erste Bank",
        number: "**** **** **** 1204",
        holder: "Patrick Giger",
        expiry: "12/28",
        color: "#38bdf8"
    },
    {
        id: 2,
        title: "Trade Republic",
        number: "**** **** **** 5678",
        holder: "Patrick Giger",
        expiry: "10/29",
        color: "#BDBDBD"
    },
    {
        id: 3,
        title: "Revolut Joint",
        number: "**** **** **** 6917",
        holder: "A. BAMMER & P. GIGER",
        expiry: "11/27",
        color: "#a855f7"
    },
    {
        id: 4,
        title: "Mein Revolut",
        number: "**** **** **** 0812",
        holder: "Patrick Giger",
        expiry: "11/25",
        color: "#6c2bd9"
    }
];

export interface Transaction {
    id: number | string;
    cardId: number;
    name: string;
    category: string;
    date: string;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    transferId?: number;
}

export interface FixedCost {
  id: number;
  name: string;
  amount: number;
  billingDay: number;
  cardId: number;
}

export const fixedCosts: FixedCost[] = [];

type RawTransaction = Omit<Transaction, 'id' | 'type' | 'cardId' | 'transferId'>;

const card1TransactionsData: RawTransaction[] = [
  // November 2025
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-11-10", amount: -100.00 },
  { name: "GOOGLE ONE", category: "Fixkosten", date: "2025-11-10", amount: -21.99 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-11-05", amount: -108.30 },
  { name: "Wiener Staedtische Versicherung AG", category: "Sonstiges", date: "2025-11-03", amount: -100.00 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-11-03", amount: -200.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-11-03", amount: -302.00 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-11-03", amount: -18.41 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-11-03", amount: -200.00 },
  // Oktober 2025
  { name: "TradeRepublic Patrick Giger", category: "Sonstiges", date: "2025-10-31", amount: -2900.00 },
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-10-31", amount: 4302.65 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-10-29", amount: -100.00 },
  { name: "POST PP 2384", category: "Sonstiges", date: "2025-10-27", amount: -24.02 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-10-27", amount: -19.02 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-10-27", amount: -100.00 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-10-23", amount: -22.38 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-10-14", amount: -100.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-10-13", amount: -100.00 },
  { name: "GOOGLE ONE", category: "Fixkosten", date: "2025-10-08", amount: -21.99 },
  { name: "GOOGLE YOUTUBE", category: "Fixkosten", date: "2025-10-06", amount: -12.99 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-10-03", amount: -100.00 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-10-03", amount: -108.30 },
  { name: "Wiener Staedtische Versicherung AG", category: "Sonstiges", date: "2025-10-01", amount: -100.00 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-10-01", amount: -200.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-10-01", amount: -302.00 },
  { name: "younion_Die Daseinsgewerkschaft", category: "Sonstiges", date: "2025-10-01", amount: -30.00 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-10-01", amount: -162.24 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-10-01", amount: -127.75 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-10-01", amount: -18.41 },
  // September 2025
  { name: "Bonus Kontoführung", category: "Einkommen", date: "2025-09-30", amount: 4.10 },
  { name: "Kontoführung", category: "Sonstiges", date: "2025-09-30", amount: -20.50 },
  { name: "TradeRepublic Patrick Giger", category: "Sonstiges", date: "2025-09-30", amount: -11000.00 },
  { name: "Patrick Tenzin Tsephel Giger", category: "Einkommen", date: "2025-09-30", amount: 10000.00 },
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-09-30", amount: 2313.23 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-09-29", amount: -19.02 },
  { name: "OBSIDIAN.MD", category: "Fixkosten", date: "2025-09-23", amount: -42.40 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-09-22", amount: -100.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-09-10", amount: -50.40 },
  { name: "GOOGLE ONE", category: "Fixkosten", date: "2025-09-08", amount: -21.99 },
  { name: "GOOGLE YOUTUBE", category: "Fixkosten", date: "2025-09-05", amount: -9.84 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-09-03", amount: -108.30 },
  { name: "younion_Die Daseinsgewerkschaft", category: "Sonstiges", date: "2025-09-01", amount: -30.00 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-09-01", amount: -127.75 },
  { name: "Allianz Elementar Versicherungs", category: "Sonstiges", date: "2025-09-01", amount: -17.51 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-09-01", amount: -200.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-09-01", amount: -302.00 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-09-01", amount: -17.43 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-09-01", amount: -162.24 },
  { name: "Wiener Staedtische Versicherung AG", category: "Sonstiges", date: "2025-09-01", amount: -100.00 },
  { name: "TradeRepublic Patrick Giger", category: "Sonstiges", date: "2025-09-01", amount: -400.00 },
  // August 2025
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-08-29", amount: -18.42 },
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-08-29", amount: 2304.11 },
  { name: "Sparkonto pgi", category: "Sonstiges", date: "2025-08-26", amount: -1000.00 },
  { name: "Patrick Giger", category: "Einkommen", date: "2025-08-26", amount: 600.00 },
  { name: "1/Stephan und Kunsang Giger", category: "Einkommen", date: "2025-08-19", amount: 450.00 },
  { name: "TradeRepublic Patrick Giger", category: "Sonstiges", date: "2025-08-14", amount: -150.00 },
  { name: "Sparkonto pgi", category: "Sonstiges", date: "2025-08-14", amount: -406.67 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-08-14", amount: -100.00 },
  { name: "TradeRepublic Patrick Giger", category: "Sonstiges", date: "2025-08-13", amount: -10.00 },
  { name: "GOOGLE YOUTUBE", category: "Fixkosten", date: "2025-08-13", amount: -12.99 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-08-11", amount: -50.40 },
  { name: "NETFLIX.COM", category: "Unterhaltung", date: "2025-08-11", amount: -8.99 },
  { name: "Sparkonto pgi", category: "Sonstiges", date: "2025-08-08", amount: -593.33 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-08-05", amount: -91.80 },
  { name: "Allianz Elementar Versicherungs", category: "Sonstiges", date: "2025-08-01", amount: -17.51 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-08-01", amount: -127.75 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-08-01", amount: -162.24 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-08-01", amount: -17.43 },
  { name: "Wiener Staedtische Versicherung AG", category: "Sonstiges", date: "2025-08-01", amount: -100.00 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-08-01", amount: -150.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-08-01", amount: -302.00 },
  { name: "N26 Patrick Giger", category: "Sonstiges", date: "2025-08-01", amount: -200.00 },
  { name: "younion_Die Daseinsgewerkschaft", category: "Sonstiges", date: "2025-08-01", amount: -30.00 },
  // Juli 2025
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-07-31", amount: 2304.27 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-07-28", amount: -18.42 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-07-21", amount: -6.99 },
  { name: "Patrick Tenzin Tsephel Giger", category: "Einkommen", date: "2025-07-15", amount: 607.07 },
  { name: "LEGO", category: "Einkaufen", date: "2025-07-15", amount: -151.98 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-07-14", amount: -1000.00 },
  { name: "GOOGLE YOUTUBE", category: "Fixkosten", date: "2025-07-14", amount: -12.99 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-07-10", amount: -50.40 },
  { name: "NETFLIX.COM", category: "Unterhaltung", date: "2025-07-09", amount: -8.99 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-07-03", amount: -91.20 },
  { name: "Sparkonto pgi", category: "Sonstiges", date: "2025-07-01", amount: -607.07 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-07-01", amount: -17.43 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-07-01", amount: -150.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-07-01", amount: -302.00 },
  { name: "N26 Patrick Giger", category: "Sonstiges", date: "2025-07-01", amount: -200.00 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-07-01", amount: -162.24 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-07-01", amount: -127.75 },
  { name: "Allianz Elementar Versicherungs", category: "Sonstiges", date: "2025-07-01", amount: -17.51 },
  // Juni 2025
  { name: "20% Bonus Kontoführung", category: "Einkommen", date: "2025-06-30", amount: 3.98 },
  { name: "Kontoführung", category: "Sonstiges", date: "2025-06-30", amount: -19.92 },
  { name: "Kest", category: "Sonstiges", date: "2025-06-30", amount: -0.02 },
  { name: "Habenzinsen", category: "Einkommen", date: "2025-06-30", amount: 0.08 },
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-06-30", amount: 2304.16 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-06-27", amount: -18.42 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-06-20", amount: -6.99 },
  { name: "Sparkonto pgi", category: "Sonstiges", date: "2025-06-20", amount: -8000.00 },
  { name: "Karl Trabitsch Ges.m.b.H.", category: "Einkommen", date: "2025-06-16", amount: 447.12 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-06-16", amount: -100.00 },
  { name: "GOOGLE YOUTUBE", category: "Fixkosten", date: "2025-06-13", amount: -12.99 },
  { name: "HDI LEBENSVERSICHERUNG AG", category: "Sonstiges", date: "2025-06-12", amount: 882.68 },
  { name: "DJ Patrick", category: "Unterhaltung", date: "2025-06-11", amount: -1300.00 },
  { name: "Via Dominorum Grundstückverwertungs GmbH", category: "Sonstiges", date: "2025-06-11", amount: -1452.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-06-10", amount: -50.40 },
  { name: "Florian Capanay", category: "Einkommen", date: "2025-06-10", amount: 30.00 },
  { name: "NETFLIX INTERNATIONAL", category: "Unterhaltung", date: "2025-06-10", amount: -8.99 },
  { name: "Jela Muncan e.U.", category: "Sonstiges", date: "2025-06-10", amount: -245.00 },
  { name: "N26 Patrick Giger", category: "Sonstiges", date: "2025-06-04", amount: -200.00 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-06-04", amount: -91.20 },
  { name: "Vyhnal/ DEKOWIEN", category: "Sonstiges", date: "2025-06-04", amount: -102.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-06-02", amount: -1500.00 },
  { name: "Allianz Elementar Versicherungs", category: "Sonstiges", date: "2025-06-02", amount: -17.51 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-06-02", amount: -156.00 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-06-02", amount: -122.84 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-06-02", amount: -150.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-06-02", amount: -302.00 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-06-02", amount: -17.43 },
  // Mai 2025
  { name: "Ana-Varinia Bammer", category: "Einkommen", date: "2025-05-30", amount: 4022.84 },
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-05-30", amount: 4901.21 },
  { name: "Vyhnal/ DEKOWIEN", category: "Sonstiges", date: "2025-05-30", amount: -4022.84 },
  { name: "Ana-Varinia Bammer", category: "Einkommen", date: "2025-05-26", amount: 2500.00 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-05-26", amount: -19.02 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-05-26", amount: -100.00 },
  { name: "Michael Kobler", category: "Einkommen", date: "2025-05-26", amount: 2500.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-05-21", amount: -1000.00 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-05-20", amount: -6.99 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-05-15", amount: -500.00 },
  { name: "Catering Trabitsch", category: "Sonstiges", date: "2025-05-14", amount: -9590.22 },
  { name: "Patrick Tenzin Tsephel Giger", category: "Einkommen", date: "2025-05-14", amount: 15000.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-05-13", amount: -100.00 },
  { name: "PANDORA STORE WIEN MA", category: "Einkaufen", date: "2025-05-13", amount: -423.00 },
  { name: "GOOGLE YOUTUBE", category: "Fixkosten", date: "2025-05-13", amount: -12.99 },
  { name: "PayPal Europe S.a.r.l. et Cie S.C.A", category: "Einkaufen", date: "2025-05-13", amount: -19.99 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-05-12", amount: -50.40 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-05-12", amount: -100.00 },
  { name: "NETFLIX INTERNATIONAL", category: "Unterhaltung", date: "2025-05-09", amount: -8.99 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-05-09", amount: -122.84 },
  { name: "1/Stephan und Kunsang Giger", category: "Einkommen", date: "2025-05-07", amount: 1200.00 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-05-06", amount: -91.20 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-05-05", amount: -100.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-05-05", amount: -100.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-05-02", amount: -100.00 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-05-02", amount: -156.00 },
  { name: "HDI LEBENSVERSICHERUNG AG", category: "Sonstiges", date: "2025-05-02", amount: -104.00 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-05-02", amount: -17.43 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-05-02", amount: -150.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-05-02", amount: -302.00 },
  { name: "Allianz Elementar Versicherungs", category: "Sonstiges", date: "2025-05-02", amount: -17.51 },
  // April 2025
  { name: "PAYPAL *KOBLER FOTO", category: "Einkaufen", date: "2025-04-30", amount: -530.00 },
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-04-30", amount: 2304.86 },
  { name: "Ana-Varinia Bammer", category: "Einkommen", date: "2025-04-28", amount: 105.00 },
  { name: "Ana-Varinia Bammer", category: "Einkommen", date: "2025-04-28", amount: 2730.00 },
  { name: "Ana-Varinia Bammer", category: "Einkommen", date: "2025-04-28", amount: 240.00 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-04-28", amount: -18.59 },
  { name: "FA Österreich - Baden Mödling", category: "Sonstiges", date: "2025-04-28", amount: -36.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-04-28", amount: -300.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-04-28", amount: -200.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-04-28", amount: -1000.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-04-28", amount: -100.00 },
  { name: "PAYPAL *MEDIAMARKTO", category: "Einkaufen", date: "2025-04-24", amount: -509.99 },
  { name: "NOTION LABS, INC.", category: "Fixkosten", date: "2025-04-23", amount: -138.92 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-04-22", amount: -6.99 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-04-22", amount: -9.98 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-04-22", amount: -9.99 },
  { name: "Via Dominorum Grundstückverwertungs GmbH", category: "Sonstiges", date: "2025-04-18", amount: -5808.00 },
  { name: "Patrick Tenzin Tsephel Giger", category: "Einkommen", date: "2025-04-18", amount: 5000.00 },
  { name: "Ana-Varinia Bammer", category: "Einkommen", date: "2025-04-16", amount: 135.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-04-14", amount: -100.00 },
  { name: "GOOGLE YOUTUBE", category: "Fixkosten", date: "2025-04-14", amount: -12.99 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-04-10", amount: -50.40 },
  { name: "NETFLIX INTERNATIONAL", category: "Unterhaltung", date: "2025-04-09", amount: -8.99 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-04-03", amount: -91.20 },
  { name: "Allianz Elementar Versicherungs", category: "Sonstiges", date: "2025-04-01", amount: -17.51 },
  { name: "Barbehebung", category: "Sonstiges", date: "2025-04-01", amount: -200.00 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-04-01", amount: -156.00 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-04-01", amount: -17.43 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-04-01", amount: -122.84 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-04-01", amount: -150.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-04-01", amount: -302.00 },
  { name: "HDI LEBENSVERSICHERUNG AG", category: "Sonstiges", date: "2025-04-01", amount: -165.18 },
  // März 2025
  { name: "10% Bonus Kontoführung", category: "Einkommen", date: "2025-03-31", amount: 1.99 },
  { name: "Kontoführung", category: "Sonstiges", date: "2025-03-31", amount: -19.92 },
  { name: "Kest", category: "Sonstiges", date: "2025-03-31", amount: -0.01 },
  { name: "Habenzinsen", category: "Einkommen", date: "2025-03-31", amount: 0.02 },
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-03-31", amount: 2304.11 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-03-28", amount: -19.10 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-03-20", amount: -6.99 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-20", amount: -3000.00 },
  { name: "Ana-Varinia Bammer", category: "Einkommen", date: "2025-03-20", amount: 1000.00 },
  { name: "PAYPAL *DYNALISTINC", category: "Einkaufen", date: "2025-03-19", amount: -47.55 },
  { name: "STANDARD Verlagsgesellschaft m.b.H.", category: "Fixkosten", date: "2025-03-19", amount: -30.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-17", amount: -500.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-14", amount: -100.00 },
  { name: "GOOGLE YOUTUBE", category: "Fixkosten", date: "2025-03-13", amount: -12.99 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-13", amount: -100.00 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-03-12", amount: -9.99 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-03-12", amount: -58.99 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-03-10", amount: -50.40 },
  { name: "NETFLIX INTERNATIONAL", category: "Unterhaltung", date: "2025-03-10", amount: -8.99 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-10", amount: -100.00 },
  { name: "PP*HUMBLEBUNDL HUMBLEB", category: "Unterhaltung", date: "2025-03-10", amount: -11.15 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-07", amount: -200.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-07", amount: -200.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-06", amount: -100.00 },
  { name: "Barbehebung", category: "Sonstiges", date: "2025-03-06", amount: -100.00 },
  { name: "Sparkonto pgi", category: "Sonstiges", date: "2025-03-06", amount: -10000.00 },
  { name: "Stephan und Kunsang Giger", category: "Einkommen", date: "2025-03-06", amount: 13001.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-05", amount: -100.00 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-03-05", amount: -156.00 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-03-05", amount: -91.20 },
  { name: "Standesamts- und Staatsbürgerschaftsverband", category: "Sonstiges", date: "2025-03-04", amount: -547.20 },
  { name: "HDI LEBENSVERSICHERUNG AG", category: "Sonstiges", date: "2025-03-03", amount: -165.18 },
  { name: "PP*HUMBLEBUNDL", category: "Unterhaltung", date: "2025-03-03", amount: -11.15 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-03", amount: -100.00 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-03-03", amount: -150.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-03-03", amount: -302.00 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-03-03", amount: -122.84 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-03-03", amount: -17.43 },
  { name: "Allianz Elementar Versicherungs", category: "Sonstiges", date: "2025-03-03", amount: -17.51 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-03-03", amount: -200.00 },
  // Februar 2025
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-02-28", amount: 4373.76 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-02-27", amount: -17.90 },
  { name: "GOOGLE PLAY APPS", category: "Unterhaltung", date: "2025-02-24", amount: -9.99 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-02-24", amount: -180.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-02-24", amount: -20.00 },
  { name: "GOOGLE*GOOGLE PLAY APP", category: "Unterhaltung", date: "2025-02-21", amount: -6.99 },
  { name: "Gabriele Änderungsschneiderei", category: "Einkaufen", date: "2025-02-20", amount: -250.00 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-02-20", amount: -100.00 },
  { name: "Barbehebung", category: "Sonstiges", date: "2025-02-17", amount: -400.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-02-14", amount: -100.00 },
  { name: "Pichler Rene", category: "Sonstiges", date: "2025-02-10", amount: -8.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-02-10", amount: -50.40 },
  { name: "PAYPAL *RINGCONN HK", category: "Einkaufen", date: "2025-02-07", amount: -303.80 },
  { name: "Barbehebung", category: "Sonstiges", date: "2025-02-05", amount: -200.00 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-02-05", amount: -91.20 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-02-03", amount: -156.00 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-02-03", amount: -17.43 },
  { name: "HDI LEBENSVERSICHERUNG AG", category: "Sonstiges", date: "2025-02-03", amount: -165.18 },
  { name: "Allianz Elementar Versicherungs", category: "Sonstiges", date: "2025-02-03", amount: -17.51 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-02-03", amount: -122.84 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-02-03", amount: -150.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-02-03", amount: -302.00 },
  // Jänner 2025
  { name: "HC immOH! GmbH", category: "Einkommen", date: "2025-01-31", amount: 2322.99 },
  { name: "A1 Telekom Austria AG", category: "Sonstiges", date: "2025-01-30", amount: -17.89 },
  { name: "REVOLUT**5943*", category: "Sonstiges", date: "2025-01-27", amount: -100.00 },
  { name: "Patrick Tenzin Tsephel Giger", category: "Einkommen", date: "2025-01-27", amount: 1000.00 },
  { name: "Barbehebung", category: "Sonstiges", date: "2025-01-27", amount: -70.00 },
  { name: "Guthaben auf Girokonten und Spareinlagen", category: "Einkommen", date: "2025-01-17", amount: 0.00 },
  { name: "BITPANDA", category: "Sonstiges", date: "2025-01-10", amount: -200.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-01-10", amount: -50.40 },
  { name: "BITPANDA", category: "Sonstiges", date: "2025-01-08", amount: -300.00 },
  { name: "One Mobility Ticketing GmbH", category: "Transport", date: "2025-01-07", amount: -91.20 },
  { name: "Patrick Tenzin Tsephel Giger", category: "Einkommen", date: "2025-01-03", amount: 1.05 },
  { name: "ARAG SE", category: "Sonstiges", date: "2025-01-02", amount: -17.43 },
  { name: "Sun Invest AG", category: "Sonstiges", date: "2025-01-02", amount: -156.00 },
  { name: "HDI LEBENSVERSICHERUNG AG", category: "Sonstiges", date: "2025-01-02", amount: -165.18 },
  { name: "Allianz Elementar Versicherungs", category: "Sonstiges", date: "2025-01-02", amount: -17.51 },
  { name: "Revolut Gemeinsames Konto", category: "Lebensmittel", date: "2025-01-02", amount: -150.00 },
  { name: "Ana-Varinia Bammer", category: "Sonstiges", date: "2025-01-02", amount: -302.00 },
  { name: "Sun Contracting AG", category: "Sonstiges", date: "2025-01-02", amount: -122.84 },
];

const tradeRepublicTransactionsData: RawTransaction[] = [
  // November 2025
  { name: "AMD", category: "Investition", date: "2025-11-10", amount: -501.00 },
  { name: "Nokia", category: "Investition", date: "2025-11-05", amount: -301.00 },
  { name: "Alphabet (A)", category: "Investition", date: "2025-11-04", amount: -501.00 },
  { name: "Gerresheimer", category: "Investition", date: "2025-11-03", amount: -501.00 },
  { name: "Zinsen", category: "Einkommen", date: "2025-11-01", amount: 13.90 },
  // Oktober 2025
  { name: "NVIDIA", category: "Investition", date: "2025-10-31", amount: -501.11 },
  { name: "Patrick Tenzin Tsephel Giger", category: "Einzahlung", date: "2025-10-31", amount: 2900.00 },
  { name: "Video Gaming & Esports USD (Acc)", category: "Investition", date: "2025-10-29", amount: -221.00 },
  { name: "Tencent Holdings", category: "Investition", date: "2025-10-29", amount: -301.00 },
  { name: "Amazon.com", category: "Investition", date: "2025-10-29", amount: -201.00 },
  { name: "Vertiv", category: "Investition", date: "2025-10-22", amount: -501.00 },
  { name: "Video Gaming & Esports USD (Acc)", category: "Investition", date: "2025-10-01", amount: -301.00 },
  { name: "Intel", category: "Investition", date: "2025-10-01", amount: -116.00 },
  { name: "Zinsen", category: "Einkommen", date: "2025-10-01", amount: 0.46 },
  // September 2025
  { name: "Patrick Tenzin Tsephel Giger", category: "Einzahlung", date: "2025-09-30", amount: 11000.00 },
  // August 2025
  { name: "Patrick Tenzin Tsephel Giger", category: "Einzahlung", date: "2025-08-30", amount: 400.00 },
  { name: "Xiaomi", category: "Investition", date: "2025-08-14", amount: -76.00 },
  { name: "Patrick Tenzin Tsephel Giger", category: "Einzahlung", date: "2025-08-14", amount: 150.00 },
  { name: "Patrick Tenzin Tsephel Giger", category: "Einzahlung", date: "2025-08-13", amount: 10.00 },
];

const card3TransactionsData: RawTransaction[] = [
    // August 2024
    { name: "Transfer from PATRICK GIGER", category: "Einzahlung", date: "2024-08-11", amount: 150.00 },
    { name: "Payment from PATRICK GIGER", category: "Einzahlung", date: "2024-08-12", amount: 518.24 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-08-13", amount: -32.72 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-08-20", amount: -79.59 },
    { name: "TEDI", category: "Einkaufen", date: "2024-08-23", amount: -11.00 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-08-24", amount: -10.47 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-08-28", amount: -36.83 },
    // September 2024
    { name: "Hofer", category: "Lebensmittel", date: "2024-09-01", amount: -7.40 },
    { name: "Huel", category: "Lebensmittel", date: "2024-09-02", amount: -95.40 },
    { name: "Payment from ANA-VARINIA BAMMER", category: "Einzahlung", date: "2024-09-02", amount: 150.00 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-09-03", amount: -37.37 },
    { name: "Modern Asia Market", category: "Lebensmittel", date: "2024-09-05", amount: -28.39 },
    { name: "dm drogerie", category: "Gesundheit", date: "2024-09-05", amount: -28.60 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-09-08", amount: -20.29 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-09-10", amount: -15.89 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-09-12", amount: -19.60 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-09-13", amount: -9.83 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-09-17", amount: -29.35 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-09-19", amount: -10.94 },
    { name: "McDonald's", category: "Unterhaltung", date: "2024-09-21", amount: -18.30 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-09-21", amount: -6.95 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-09-22", amount: -14.15 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-09-22", amount: -54.50 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-09-25", amount: -12.99 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-09-26", amount: -29.17 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-09-29", amount: -18.19 },
    // Oktober 2024
    { name: "Payment from ANA-VARINIA BAMMER", category: "Einzahlung", date: "2024-10-01", amount: 150.00 },
    { name: "Payment from PATRICK TENZIN TSEPHEL GIGER", category: "Einzahlung", date: "2024-10-02", amount: 150.00 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-02", amount: -8.04 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-03", amount: -6.72 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-10-03", amount: -6.32 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-10-04", amount: -23.80 },
    { name: "Bäckerei Ströck", category: "Lebensmittel", date: "2024-10-05", amount: -6.05 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-06", amount: -7.24 },
    { name: "Müller", category: "Einkaufen", date: "2024-10-06", amount: -0.62 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-10-06", amount: -8.00 },
    { name: "BIPA", category: "Einkaufen", date: "2024-10-06", amount: -2.18 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-09", amount: -12.02 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-10", amount: -7.48 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-14", amount: -30.84 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-17", amount: -12.64 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-20", amount: -7.67 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-10-20", amount: -9.81 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-22", amount: -20.20 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-10-23", amount: -17.35 },
    { name: "Stammhaus", category: "Unterhaltung", date: "2024-10-27", amount: -56.00 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-29", amount: -17.78 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-10-31", amount: -4.58 },
    // November 2024
    { name: "Payment from PATRICK TENZIN TSEPHEL GIGER", category: "Einzahlung", date: "2024-11-01", amount: 150.00 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-11-01", amount: -3.48 },
    { name: "Payment from ANA-VARINIA BAMMER", category: "Einzahlung", date: "2024-11-04", amount: 150.00 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-11-10", amount: -44.37 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-11-14", amount: -8.96 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-11-15", amount: -23.00 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-11-17", amount: -14.02 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-11-26", amount: -31.52 },
    { name: "SPAR Food & Fuel", category: "Lebensmittel", date: "2024-11-28", amount: -15.05 },
    // Dezember 2024
    { name: "BILLA", category: "Lebensmittel", date: "2024-12-01", amount: -23.49 },
    { name: "Payment from ANA-VARINIA BAMMER", category: "Einzahlung", date: "2024-12-02", amount: 150.00 },
    { name: "Payment from PATRICK TENZIN TSEPHEL GIGER", category: "Einzahlung", date: "2024-12-03", amount: 150.00 },
    { name: "Lieferando", category: "Unterhaltung", date: "2024-12-08", amount: -25.58 },
    { name: "Lieferando", category: "Unterhaltung", date: "2024-12-09", amount: -26.07 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-12-12", amount: -19.82 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-12-13", amount: -14.99 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-12-13", amount: -32.14 },
    { name: "McDonald's", category: "Unterhaltung", date: "2024-12-14", amount: -10.30 },
    { name: "Delivery Hero", category: "Unterhaltung", date: "2024-12-16", amount: -26.10 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-12-17", amount: -16.70 },
    { name: "Hofer", category: "Lebensmittel", date: "2024-12-20", amount: -21.51 },
    { name: "Delivery Hero", category: "Unterhaltung", date: "2024-12-23", amount: -30.68 },
    { name: "Delivery Hero", category: "Unterhaltung", date: "2024-12-23", amount: -29.21 },
    { name: "Uber", category: "Transport", date: "2024-12-25", amount: -35.50 },
    { name: "Delivery Hero", category: "Unterhaltung", date: "2024-12-28", amount: -28.16 },
    { name: "Apotheke Town Town", category: "Gesundheit", date: "2024-12-28", amount: -50.86 },
    { name: "BILLA", category: "Lebensmittel", date: "2024-12-29", amount: -75.44 },
    // Jänner 2025
    { name: "Spar", category: "Lebensmittel", date: "2025-01-01", amount: -0.21 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-01-01", amount: -25.80 },
    { name: "Payment from ANA-VARINIA BAMMER", category: "Einzahlung", date: "2025-01-02", amount: 150.00 },
    { name: "Payment from PATRICK TENZIN TSEPHEL GIGER", category: "Einzahlung", date: "2025-01-03", amount: 150.00 },
    { name: "Hofer", category: "Lebensmittel", date: "2025-01-03", amount: -9.21 },
    { name: "Hofer", category: "Lebensmittel", date: "2025-01-05", amount: -23.59 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-01-05", amount: -8.68 },
    { name: "Euroscope", category: "Unterhaltung", date: "2025-01-06", amount: -2.00 },
    { name: "Delivery Hero", category: "Unterhaltung", date: "2025-01-09", amount: -34.28 },
    { name: "Hofer", category: "Lebensmittel", date: "2025-01-12", amount: -7.16 },
    { name: "Delivery Hero", category: "Unterhaltung", date: "2025-01-14", amount: -34.51 },
    { name: "Hofer", category: "Lebensmittel", date: "2025-01-14", amount: -16.04 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-01-16", amount: -6.43 },
    { name: "Hofer", category: "Lebensmittel", date: "2025-01-18", amount: -21.65 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-01-19", amount: -9.90 },
    { name: "Delivery Hero", category: "Unterhaltung", date: "2025-01-21", amount: -38.15 },
];

const revolutTransactionsData: RawTransaction[] = [
    { name: "Amazon", category: "Einkaufen", date: "2025-01-01", amount: -18.66 },
    { name: "willhaben", category: "Einkaufen", date: "2025-01-02", amount: -108.30 },
    { name: "Steam", category: "Unterhaltung", date: "2025-01-02", amount: -1.95 },
    { name: "Müller", category: "Einkaufen", date: "2025-01-02", amount: -1.95 },
    { name: "willhaben", category: "Einkommen", date: "2025-01-04", amount: 108.30 },
    { name: "To pocket EUR for subscriptions from EUR", category: "Fixkosten", date: "2025-01-05", amount: -50.00 },
    { name: "Amazon", category: "Einkaufen", date: "2025-01-08", amount: -7.04 },
    { name: "Amazon", category: "Einkaufen", date: "2025-01-09", amount: -7.19 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-01-09", amount: -4.78 },
    { name: "HoYoverse", category: "Unterhaltung", date: "2025-01-09", amount: -9.99 },
    { name: "Steam", category: "Unterhaltung", date: "2025-01-10", amount: -2.61 },
    { name: "Sodexo", category: "Lebensmittel", date: "2025-01-11", amount: -4.51 },
    { name: "Steam", category: "Unterhaltung", date: "2025-01-12", amount: -9.67 },
    { name: "Gamefound", category: "Einkaufen", date: "2025-01-14", amount: -17.17 },
    { name: "Wienerwald Apotheke", category: "Gesundheit", date: "2025-01-14", amount: -49.15 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-01-15", amount: -1.90 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-01-17", amount: -1.90 },
    { name: "Premium plan fee", category: "Fixkosten", date: "2025-01-19", amount: -8.99 },
    { name: "SMACK Handautomat", category: "Unterhaltung", date: "2025-01-19", amount: -20.00 },
    { name: "Westfield Scs", category: "Einkaufen", date: "2025-01-19", amount: -2.00 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-01-22", amount: -2.49 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-01-23", amount: -3.99 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-01-23", amount: -2.99 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-01-25", amount: -29.00 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-01-25", amount: -0.23 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-01-26", amount: 100.00 },
    { name: "Google Play", category: "Unterhaltung", date: "2025-01-27", amount: -21.99 },
    { name: "Early plan termination fee", category: "Fixkosten", date: "2025-01-29", amount: -17.98 },
    { name: "To pocket EUR for subscriptions from EUR", category: "Fixkosten", date: "2025-02-05", amount: -50.00 },
    { name: "Google Play", category: "Unterhaltung", date: "2025-02-09", amount: -8.99 },
    { name: "Pocket Withdrawal", category: "Sonstiges", date: "2025-02-09", amount: 80.04 },
    { name: "Sodexo", category: "Lebensmittel", date: "2025-02-11", amount: -3.28 },
    { name: "Steam", category: "Unterhaltung", date: "2025-02-11", amount: -23.21 },
    { name: "YouTube", category: "Unterhaltung", date: "2025-02-13", amount: -12.99 },
    { name: "SPAR Food & Fuel", category: "Lebensmittel", date: "2025-02-14", amount: -0.23 },
    { name: "SPAR Food & Fuel", category: "Lebensmittel", date: "2025-02-14", amount: -14.84 },
    { name: "Gamefound", category: "Einkaufen", date: "2025-02-14", amount: -17.17 },
    { name: "Humble Bundle", category: "Unterhaltung", date: "2025-02-16", amount: -17.23 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-02-19", amount: 100.00 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-02-20", amount: -14.20 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-02-21", amount: 20.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-02-21", amount: 180.00 },
    { name: "Temu", category: "Einkaufen", date: "2025-02-22", amount: -146.04 },
    { name: "Foodora", category: "Lebensmittel", date: "2025-02-22", amount: -50.29 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-01", amount: 200.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-02", amount: 100.00 },
    { name: "Foodora", category: "Lebensmittel", date: "2025-03-03", amount: -31.13 },
    { name: "Steam", category: "Unterhaltung", date: "2025-03-03", amount: -215.62 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-03", amount: -7.00 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-03", amount: -42.70 },
    { name: "Foodora", category: "Lebensmittel", date: "2025-03-04", amount: -36.05 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-05", amount: 100.00 },
    { name: "itch.io", category: "Unterhaltung", date: "2025-03-05", amount: -18.94 },
    { name: "Thalia", category: "Einkaufen", date: "2025-03-06", amount: -43.39 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-06", amount: 100.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-06", amount: 200.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-06", amount: 200.00 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-06", amount: -37.45 },
    { name: "Your.software", category: "Einkaufen", date: "2025-03-06", amount: -54.90 },
    { name: "HUMANIC", category: "Einkaufen", date: "2025-03-07", amount: -227.79 },
    { name: "Post 1235", category: "Transport", date: "2025-03-07", amount: -8.20 },
    { name: "IKEA", category: "Einkaufen", date: "2025-03-07", amount: -7.75 },
    { name: "Peek & Cloppenburg", category: "Einkaufen", date: "2025-03-07", amount: -170.27 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-08", amount: 100.00 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-09", amount: -32.64 },
    { name: "Steam", category: "Unterhaltung", date: "2025-03-09", amount: -49.99 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-09", amount: -38.10 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-09", amount: -9.10 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-12", amount: 100.00 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-13", amount: -10.15 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-13", amount: -8.49 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-13", amount: -5.95 },
    { name: "Stammhaus", category: "Unterhaltung", date: "2025-03-13", amount: -45.00 },
    { name: "Temu", category: "Einkaufen", date: "2025-03-13", amount: -72.50 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-13", amount: 100.00 },
    { name: "Gamefound", category: "Einkaufen", date: "2025-03-14", amount: -17.17 },
    { name: "Vinted", category: "Einkaufen", date: "2025-03-14", amount: -20.15 },
    { name: "BIPA", category: "Einkaufen", date: "2025-03-14", amount: -3.90 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-14", amount: 500.00 },
    { name: "Thalia", category: "Einkaufen", date: "2025-03-15", amount: -119.00 },
    { name: "Post 1235", category: "Transport", date: "2025-03-15", amount: -12.12 },
    { name: "Klangfarbe", category: "Einkaufen", date: "2025-03-15", amount: -243.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-03-19", amount: 3000.00 },
    { name: "Booking.com", category: "Transport", date: "2025-03-20", amount: -1116.65 },
    { name: "Booking.com", category: "Transport", date: "2025-03-20", amount: -986.52 },
    { name: "Foodora", category: "Lebensmittel", date: "2025-03-22", amount: -34.51 },
    { name: "MediaMarkt", category: "Einkaufen", date: "2025-03-23", amount: -47.28 },
    { name: "Anker", category: "Einkaufen", date: "2025-03-24", amount: -1.50 },
    { name: "Foodora", category: "Lebensmittel", date: "2025-03-25", amount: -35.59 },
    { name: "Frick Riverside", category: "Unterhaltung", date: "2025-03-27", amount: -54.40 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-03-27", amount: -3.80 },
    { name: "DEPOT", category: "Einkaufen", date: "2025-03-27", amount: -12.98 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-03-28", amount: -6.25 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-03-28", amount: -7.90 },
    { name: "Amazon", category: "Einkaufen", date: "2025-03-28", amount: -199.51 },
    { name: "Foodora", category: "Lebensmittel", date: "2025-03-28", amount: -19.47 },
    { name: "Trafik Heindl", category: "Sonstiges", date: "2025-03-29", amount: -9.10 },
    { name: "Amazon", category: "Einkaufen", date: "2025-04-04", amount: -42.11 },
    { name: "Temu", category: "Einkaufen", date: "2025-04-05", amount: -104.73 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-04-05", amount: -5.05 },
    { name: "Amazon", category: "Einkaufen", date: "2025-04-06", amount: -29.14 },
    { name: "Apotheke Town Town", category: "Gesundheit", date: "2025-04-08", amount: -5.67 },
    { name: "Cash withdrawal at Bank99 Ag", category: "Sonstiges", date: "2025-04-11", amount: -10.00 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-04-13", amount: -22.80 },
    { name: "Gamefound", category: "Einkaufen", date: "2025-04-14", amount: -17.17 },
    { name: "Temu", category: "Einkaufen", date: "2025-04-17", amount: -30.40 },
    { name: "Amazon", category: "Einkommen", date: "2025-04-18", amount: 0.22 },
    { name: "Amazon", category: "Einkaufen", date: "2025-04-18", amount: -29.93 },
    { name: "Selecta", category: "Sonstiges", date: "2025-04-18", amount: -3.00 },
    { name: "Selecta", category: "Sonstiges", date: "2025-04-18", amount: -3.30 },
    { name: "Sushi Buffet Bowl", category: "Unterhaltung", date: "2025-04-21", amount: -48.00 },
    { name: "Amazon", category: "Einkaufen", date: "2025-04-24", amount: -41.33 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-04-25", amount: -6.50 },
    { name: "Cash withdrawal at Denizbank Ag", category: "Sonstiges", date: "2025-04-26", amount: -100.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-04-27", amount: 1000.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-04-27", amount: 300.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-04-27", amount: 100.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-04-27", amount: 200.00 },
    { name: "Booking.com", category: "Transport", date: "2025-04-28", amount: -649.06 },
    { name: "Booking.com", category: "Transport", date: "2025-04-28", amount: -503.05 },
    { name: "Headout", category: "Unterhaltung", date: "2025-04-28", amount: -242.23 },
    { name: "Shinkansenticket", category: "Transport", date: "2025-04-28", amount: -231.15 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-04-30", amount: -5.90 },
    { name: "Sodexo", category: "Lebensmittel", date: "2025-05-01", amount: -3.28 },
    { name: "Disney Resorts", category: "Unterhaltung", date: "2025-05-01", amount: -104.47 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-05-02", amount: 100.00 },
    { name: "Ikono", category: "Unterhaltung", date: "2025-05-03", amount: -46.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-05-03", amount: 100.00 },
    { name: "MyHeritage", category: "Sonstiges", date: "2025-05-03", amount: -42.00 },
    { name: "LEGO Store", category: "Einkaufen", date: "2025-05-04", amount: -4.98 },
    { name: "NANU-NANA", category: "Einkaufen", date: "2025-05-04", amount: -4.95 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-05-05", amount: 100.00 },
    { name: "Müller", category: "Einkaufen", date: "2025-05-05", amount: -42.20 },
    { name: "Google Play", category: "Unterhaltung", date: "2025-05-06", amount: -98.99 },
    { name: "Vinted", category: "Einkommen", date: "2025-05-08", amount: 10.15 },
    { name: "Google One", category: "Fixkosten", date: "2025-05-09", amount: -10.99 },
    { name: "Wienerwald Apotheke", category: "Gesundheit", date: "2025-05-09", amount: -37.85 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-05-10", amount: 100.00 },
    { name: "Amazon", category: "Einkaufen", date: "2025-05-10", amount: -49.42 },
    { name: "HoYoverse", category: "Unterhaltung", date: "2025-05-11", amount: -99.99 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-05-12", amount: 100.00 },
    { name: "Post 1070", category: "Transport", date: "2025-05-13", amount: -8.20 },
    { name: "Cinnamood", category: "Unterhaltung", date: "2025-05-13", amount: -5.90 },
    { name: "Amazon", category: "Einkaufen", date: "2025-05-14", amount: -18.71 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-05-14", amount: 500.00 },
    { name: "Gamefound", category: "Einkaufen", date: "2025-05-14", amount: -17.17 },
    { name: "Floristik", category: "Einkaufen", date: "2025-05-14", amount: -24.45 },
    { name: "willhaben", category: "Einkaufen", date: "2025-05-15", amount: -195.90 },
    { name: "Crazy Factory", category: "Einkaufen", date: "2025-05-17", amount: -27.84 },
    { name: "HoYoverse", category: "Unterhaltung", date: "2025-05-19", amount: -49.99 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-05-20", amount: 1000.00 },
    { name: "Exchanged to JPY", category: "Sonstiges", date: "2025-05-20", amount: -1000.00 },
    { name: "Cash withdrawal at Denizbank Ag", category: "Sonstiges", date: "2025-05-21", amount: -100.00 },
    { name: "Amazon", category: "Einkaufen", date: "2025-05-22", amount: -48.38 },
    { name: "Cash withdrawal at Denizbank Ag", category: "Sonstiges", date: "2025-05-22", amount: -50.00 },
    { name: "gog.com", category: "Unterhaltung", date: "2025-05-22", amount: -9.19 },
    { name: "Post Pp 2384", category: "Transport", date: "2025-05-23", amount: -16.90 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-05-24", amount: -9.50 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-05-24", amount: 100.00 },
    { name: "Comictreff Buchhandlungs", category: "Einkaufen", date: "2025-05-24", amount: -10.30 },
    { name: "eBay", category: "Einkaufen", date: "2025-05-26", amount: -48.42 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-05-27", amount: -9.90 },
    { name: "Floristik", category: "Einkommen", date: "2025-05-27", amount: 24.45 },
    { name: "Obsidian", category: "Fixkosten", date: "2025-05-30", amount: -42.80 },
    { name: "Google Play", category: "Unterhaltung", date: "2025-05-31", amount: -5.99 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-06-02", amount: 1500.00 },
    { name: "Sodexo", category: "Lebensmittel", date: "2025-06-06", amount: -3.39 },
    { name: "Amazon", category: "Einkaufen", date: "2025-06-06", amount: -60.49 },
    { name: "Nintendo", category: "Unterhaltung", date: "2025-06-07", amount: -39.99 },
    { name: "Lucky Kitchen", category: "Unterhaltung", date: "2025-06-07", amount: -13.70 },
    { name: "Google Play", category: "Unterhaltung", date: "2025-06-08", amount: -4.09 },
    { name: "Google One", category: "Fixkosten", date: "2025-06-09", amount: -10.99 },
    { name: "www.1global.com/*London", category: "Sonstiges", date: "2025-06-11", amount: -13.84 },
    { name: "Heinemann Duty-free", category: "Einkaufen", date: "2025-06-13", amount: -45.64 },
    { name: "Shou Du Ji Chang", category: "Einkaufen", date: "2025-06-14", amount: -21.41 },
    { name: "Beijing Capital International Airport", category: "Einkaufen", date: "2025-06-14", amount: -2.70 },
    { name: "Obsidian", category: "Fixkosten", date: "2025-06-18", amount: -42.14 },
    { name: "Getyourguide", category: "Unterhaltung", date: "2025-06-20", amount: -26.32 },
    { name: "Exchanged to JPY", category: "Sonstiges", date: "2025-06-23", amount: -300.00 },
    { name: "Exchanged to JPY", category: "Sonstiges", date: "2025-06-25", amount: -64.72 },
    { name: "Exchanged to EUR", category: "Einzahlung", date: "2025-06-25", amount: 128.53 },
    { name: "Beijing Capital International Airport", category: "Einkaufen", date: "2025-06-25", amount: -4.36 },
    { name: "Beijing Capital International Airport", category: "Einkaufen", date: "2025-06-25", amount: -4.84 },
    { name: "Beijing Capital International Airport", category: "Einkaufen", date: "2025-06-25", amount: -4.35 },
    { name: "Rishang Mianshuihang (", category: "Einkaufen", date: "2025-06-25", amount: -16.69 },
    { name: "Shou Du Ji Chang", category: "Einkaufen", date: "2025-06-25", amount: -5.20 },
    { name: "Refund Globalblue.com", category: "Einkommen", date: "2025-06-25", amount: 5.09 },
    { name: "LEGO Store", category: "Einkaufen", date: "2025-07-01", amount: -45.98 },
    { name: "HoYoverse", category: "Unterhaltung", date: "2025-07-01", amount: -0.99 },
    { name: "HoYoverse", category: "Unterhaltung", date: "2025-07-01", amount: -4.99 },
    { name: "HoYoverse", category: "Unterhaltung", date: "2025-07-01", amount: -29.99 },
    { name: "HoYoverse", category: "Unterhaltung", date: "2025-07-01", amount: -14.99 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-07-02", amount: -8.92 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-07-03", amount: -3.73 },
    { name: "Nintendo", category: "Unterhaltung", date: "2025-07-07", amount: -29.99 },
    { name: "Kilo Code", category: "Sonstiges", date: "2025-07-07", amount: -12.91 },
    { name: "Google One", category: "Fixkosten", date: "2025-07-09", amount: -21.99 },
    { name: "SPAR Food & Fuel", category: "Lebensmittel", date: "2025-07-09", amount: -2.38 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-07-11", amount: -6.20 },
    { name: "Crazy Factory", category: "Einkaufen", date: "2025-07-11", amount: -30.35 },
    { name: "Amazon", category: "Einkaufen", date: "2025-07-11", amount: -95.89 },
    { name: "Szihn", category: "Lebensmittel", date: "2025-07-11", amount: -10.80 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-07-13", amount: 1000.00 },
    { name: "Kilo Code", category: "Sonstiges", date: "2025-07-13", amount: -13.03 },
    { name: "Chijingmwn4", category: "Einkaufen", date: "2025-07-13", amount: -213.26 },
    { name: "Kilo Code", category: "Sonstiges", date: "2025-07-13", amount: -13.03 },
    { name: "Kilo Code", category: "Sonstiges", date: "2025-07-14", amount: -13.03 },
    { name: "G Star Store Wien Scs", category: "Einkaufen", date: "2025-07-15", amount: -69.96 },
    { name: "Kilo Code", category: "Sonstiges", date: "2025-07-15", amount: -12.89 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-07-17", amount: -16.00 },
    { name: "Post Pp 2384", category: "Transport", date: "2025-07-18", amount: -3.40 },
    { name: "Santorini Im Gruenen Baum", category: "Unterhaltung", date: "2025-07-23", amount: -35.00 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-07-25", amount: -8.60 },
    { name: "Disney+", category: "Unterhaltung", date: "2025-07-28", amount: -9.99 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-07-31", amount: -16.52 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-08-01", amount: -6.50 },
    { name: "Smyths Toys Superstores", category: "Einkaufen", date: "2025-08-02", amount: -29.96 },
    { name: "YouTube", category: "Unterhaltung", date: "2025-08-03", amount: -21.99 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-08-04", amount: -7.75 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-08-05", amount: -6.50 },
    { name: "Steam", category: "Unterhaltung", date: "2025-08-05", amount: -23.49 },
    { name: "Bäckerei Ströck", category: "Lebensmittel", date: "2025-08-05", amount: -3.55 },
    { name: "Google One", category: "Fixkosten", date: "2025-08-09", amount: -21.99 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-08-13", amount: -19.40 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-08-13", amount: -13.20 },
    { name: "Transfer to Revolut user", category: "Sonstiges", date: "2025-08-14", amount: -200.00 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-08-15", amount: -6.10 },
    { name: "Smyths Toys Superstores", category: "Einkaufen", date: "2025-08-18", amount: -449.99 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-08-20", amount: -3.20 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-08-23", amount: -11.15 },
    { name: "Nintendo", category: "Unterhaltung", date: "2025-08-24", amount: -26.99 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-08-28", amount: -3.99 },
    { name: "Müller", category: "Einkaufen", date: "2025-08-30", amount: -5.90 },
    { name: "SPAR Food & Fuel", category: "Lebensmittel", date: "2025-08-30", amount: -3.99 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-08-30", amount: -10.20 },
    { name: "Google Play", category: "Unterhaltung", date: "2025-09-03", amount: -8.99 },
    { name: "SPAR Food & Fuel", category: "Lebensmittel", date: "2025-09-05", amount: -3.99 },
    { name: "SPAR Food & Fuel", category: "Lebensmittel", date: "2025-09-06", amount: -3.99 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-09-11", amount: -3.29 },
    { name: "Cineplexx", category: "Unterhaltung", date: "2025-09-13", amount: -75.30 },
    { name: "Stammhaus", category: "Unterhaltung", date: "2025-09-13", amount: -56.00 },
    { name: "Comictreff Buchhandlungs", category: "Einkaufen", date: "2025-09-14", amount: -10.30 },
    { name: "Venezia", category: "Unterhaltung", date: "2025-09-15", amount: -16.00 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-09-17", amount: -6.90 },
    { name: "PGYTech", category: "Einkaufen", date: "2025-09-17", amount: -24.72 },
    { name: "HoYoverse", category: "Unterhaltung", date: "2025-09-20", amount: -9.99 },
    { name: "Temu", category: "Einkaufen", date: "2025-09-21", amount: -140.37 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-09-22", amount: 100.00 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-09-23", amount: -10.67 },
    { name: "Der Mann 9012", category: "Lebensmittel", date: "2025-09-23", amount: -3.10 },
    { name: "Amazon", category: "Einkaufen", date: "2025-09-25", amount: -40.88 },
    { name: "McDonald's", category: "Unterhaltung", date: "2025-09-26", amount: -12.90 },
    { name: "Foodora", category: "Lebensmittel", date: "2025-09-29", amount: -18.15 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-09-30", amount: -24.50 },
    { name: "Sodexo", category: "Lebensmittel", date: "2025-10-01", amount: -4.45 },
    { name: "Der Mann 9012", category: "Lebensmittel", date: "2025-10-01", amount: -3.10 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-10-03", amount: 100.00 },
    { name: "Transfer to ANA VARINIA BAMMER", category: "Sonstiges", date: "2025-10-03", amount: -42.00 },
    { name: "Burger King", category: "Unterhaltung", date: "2025-10-04", amount: -5.10 },
    { name: "Müller", category: "Einkaufen", date: "2025-10-06", amount: -14.81 },
    { name: "Der Mann 9021", category: "Lebensmittel", date: "2025-10-07", amount: -12.20 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-10-12", amount: 100.00 },
    { name: "Temu", category: "Einkaufen", date: "2025-10-13", amount: -73.26 },
    { name: "Landesklinikum Mödling", category: "Gesundheit", date: "2025-10-13", amount: -2.50 },
    { name: "BILLA", category: "Lebensmittel", date: "2025-10-18", amount: -1.79 },
    { name: "Sodexo", category: "Lebensmittel", date: "2025-10-21", amount: -2.30 },
    { name: "Parken Parkdeck Sued", category: "Transport", date: "2025-10-23", amount: -1.00 },
    { name: "Uber", category: "Transport", date: "2025-10-23", amount: -52.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-10-24", amount: 100.00 },
    { name: "Restaurant Sternzeichen", category: "Unterhaltung", date: "2025-10-25", amount: -43.00 },
    { name: "IKEA", category: "Einkaufen", date: "2025-10-26", amount: -59.99 },
    { name: "Castelletto", category: "Unterhaltung", date: "2025-10-26", amount: -2.10 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-10-28", amount: 100.00 },
    { name: "Ginza Sushi", category: "Unterhaltung", date: "2025-10-29", amount: -19.40 },
    { name: "Amazon", category: "Einkaufen", date: "2025-10-31", amount: -51.58 },
    { name: "Szihn", category: "Lebensmittel", date: "2025-10-31", amount: -7.18 },
    { name: "Landesklinikum Mödling", category: "Gesundheit", date: "2025-11-01", amount: -1.50 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-11-02", amount: 200.00 },
    { name: "Vinted", category: "Einkaufen", date: "2025-11-03", amount: -99.29 },
    { name: "YouTube", category: "Unterhaltung", date: "2025-11-04", amount: -10.11 },
    { name: "Cineplexx", category: "Unterhaltung", date: "2025-11-05", amount: -22.60 },
    { name: "Amazon", category: "Einkaufen", date: "2025-11-07", amount: -51.93 },
    { name: "Zentrum Teesdorf 3100", category: "Sonstiges", date: "2025-11-09", amount: -5.00 },
    { name: "Top-up by *0587", category: "Einzahlung", date: "2025-11-09", amount: 100.00 },
    { name: "Amazon", category: "Einkaufen", date: "2025-11-10", amount: -12.60 },
    { name: "Cineplexx", category: "Unterhaltung", date: "2025-11-10", amount: -25.40 },
    { name: "Aha", category: "Sonstiges", date: "2025-11-13", amount: -3.99 },
];

const processTransactions = (): Transaction[] => {
  const card1Data = [...card1TransactionsData];
  const card2Data = [...tradeRepublicTransactionsData];
  const card3Data = [...card3TransactionsData];
  const card4Data = [...revolutTransactionsData];
  
  const transfers: Transaction[] = [];
  const processedIndicesCard1 = new Set<number>();
  const processedIndicesCard2 = new Set<number>();
  const processedIndicesCard3 = new Set<number>();
  const processedIndicesCard4 = new Set<number>();

  // Process transfers between Card 1 (Erste Bank) and Card 2 (Trade Republic)
  card1Data.forEach((t1, index1) => {
    if (t1.amount < 0 && t1.name.toLowerCase().includes('traderepublic')) {
      const potentialMatchIndex = card2Data.findIndex((t2, index2) => {
        if (processedIndicesCard2.has(index2)) return false;
        const date1 = new Date(t1.date);
        const date2 = new Date(t2.date);
        const dateDiff = Math.abs(date1.getTime() - date2.getTime());
        const daysDiff = dateDiff / (1000 * 3600 * 24);
        return (t2.amount > 0 && Math.abs(t1.amount) === t2.amount && daysDiff <= 3);
      });

      if (potentialMatchIndex > -1) {
        const t2 = card2Data[potentialMatchIndex];
        const transferId = Date.now() + index1;
        transfers.push(
          { id: `transfer-src-${transferId}`, cardId: 1, name: 'Übertrag an Trade Republic', category: 'Übertrag', date: t1.date, amount: t1.amount, type: 'transfer', transferId },
          { id: `transfer-dest-${transferId}`, cardId: 2, name: 'Übertrag von Erste Bank', category: 'Übertrag', date: t2.date, amount: t2.amount, type: 'transfer', transferId }
        );
        processedIndicesCard1.add(index1);
        processedIndicesCard2.add(potentialMatchIndex);
      }
    }
  });
  
  // Process transfers between Card 1 (Erste Bank) and Card 3 (Revolut Joint)
   card1Data.forEach((t1, index1) => {
    if (processedIndicesCard1.has(index1)) return;
    if (t1.amount < 0 && t1.name.toLowerCase().includes('revolut gemeinsames konto')) {
      const potentialMatchIndex = card3Data.findIndex((t3, index3) => {
        if (processedIndicesCard3.has(index3)) return false;
        const date1 = new Date(t1.date);
        const date3 = new Date(t3.date);
        const dateDiff = Math.abs(date1.getTime() - date3.getTime());
        const daysDiff = dateDiff / (1000 * 3600 * 24);
        return (t3.amount > 0 && Math.abs(t1.amount) === t3.amount && daysDiff <= 3);
      });

      if (potentialMatchIndex > -1) {
        const t3 = card3Data[potentialMatchIndex];
        const transferId = Date.now() + index1 + 10000;
        transfers.push(
          { id: `transfer-src-${transferId}`, cardId: 1, name: 'Übertrag an Revolut Joint', category: 'Übertrag', date: t1.date, amount: t1.amount, type: 'transfer', transferId },
          { id: `transfer-dest-${transferId}`, cardId: 3, name: 'Übertrag von Erste Bank', category: 'Übertrag', date: t3.date, amount: t3.amount, type: 'transfer', transferId }
        );
        processedIndicesCard1.add(index1);
        processedIndicesCard3.add(potentialMatchIndex);
      }
    }
  });

    // Process transfers between Card 1 (Erste Bank) and Card 4 (Mein Revolut)
    card1Data.forEach((t1, index1) => {
        if (processedIndicesCard1.has(index1)) return;
        // Heuristic: Check for a specific naming convention from Erste Bank for Revolut top-ups
        if (t1.amount < 0 && t1.name.toLowerCase().startsWith('revolut**')) {
            const potentialMatchIndex = card4Data.findIndex((t4, index4) => {
                if (processedIndicesCard4.has(index4)) return false;
                const date1 = new Date(t1.date);
                const date4 = new Date(t4.date);
                const dateDiff = Math.abs(date1.getTime() - date4.getTime());
                const daysDiff = dateDiff / (1000 * 3600 * 24);
                // Heuristic: Match a negative amount from bank with a positive "Einzahlung" on Revolut within a few days
                return (t4.amount > 0 && Math.abs(t1.amount) === t4.amount && t4.category === 'Einzahlung' && daysDiff <= 3);
            });

            if (potentialMatchIndex > -1) {
                const t4 = card4Data[potentialMatchIndex];
                const transferId = Date.now() + index1 + 20000; // Use a unique offset
                transfers.push(
                    { id: `transfer-src-${transferId}`, cardId: 1, name: 'Übertrag an Mein Revolut', category: 'Übertrag', date: t1.date, amount: t1.amount, type: 'transfer', transferId },
                    { id: `transfer-dest-${transferId}`, cardId: 4, name: 'Übertrag von Erste Bank', category: 'Übertrag', date: t4.date, amount: t4.amount, type: 'transfer', transferId }
                );
                processedIndicesCard1.add(index1);
                processedIndicesCard4.add(potentialMatchIndex);
            }
        }
    });

  const remainingCard1Data = card1Data.filter((_, index) => !processedIndicesCard1.has(index));
  const remainingCard2Data = card2Data.filter((_, index) => !processedIndicesCard2.has(index));
  const remainingCard3Data = card3Data.filter((_, index) => !processedIndicesCard3.has(index));
  const remainingCard4Data = card4Data.filter((_, index) => !processedIndicesCard4.has(index));

  const regularTransactionsCard1: Transaction[] = remainingCard1Data.map((t, index) => ({
    ...t, id: `c1-reg-${Date.now() + index}`, cardId: 1, type: t.amount > 0 ? 'income' : 'expense',
  }));
  const regularTransactionsCard2: Transaction[] = remainingCard2Data.map((t, index) => ({
    ...t, id: `c2-reg-${Date.now() + index}`, cardId: 2, type: t.amount > 0 ? 'income' : 'expense',
  }));
   const regularTransactionsCard3: Transaction[] = remainingCard3Data.map((t, index) => ({
    ...t, id: `c3-reg-${Date.now() + index}`, cardId: 3, type: t.amount > 0 ? 'income' : 'expense',
  }));
  const regularTransactionsCard4: Transaction[] = remainingCard4Data.map((t, index) => ({
    ...t, id: `c4-reg-${Date.now() + index}`, cardId: 4, type: t.amount > 0 ? 'income' : 'expense',
  }));


  return [...transfers, ...regularTransactionsCard1, ...regularTransactionsCard2, ...regularTransactionsCard3, ...regularTransactionsCard4];
};

export const transactions: Transaction[] = processTransactions();