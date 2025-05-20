// Wspólne typy dla plików route.ts
export type IdRouteContext = {
  params: {
    id: string;
  };
};

// Typy dla danych formularza
export interface SacramentData {
  type: string;
  date: string;
}

export interface MassData {
  time: string;
  intention: string;
}

export interface AddressData {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

export interface AnnouncementContentData {
  order: number;
  text: string;
}
