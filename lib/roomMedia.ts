import type { Room } from "@/types/hotel";

const DEFAULT_DESC =
  "Phòng nội thất hiện đại, giường cao cấp, đa dạng tiện nghi và không gian sang trọng.";

const IMAGE_SETS = [
  [
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1280&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&w=1280&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1280&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1280&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=1280&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1631049035637-3e5f74d3c19d?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1576675784201-0e142b423952?auto=format&fit=crop&w=1280&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1280&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1280&q=80",
  ],
];

export type EnrichedRoom = Room & { desc: string; images: string[] };

export function enrichRoom(room: Room, index: number): EnrichedRoom {
  const i = index >= 0 ? index : 0;
  const setA = IMAGE_SETS[i % IMAGE_SETS.length];
  const setB = IMAGE_SETS[(i + 2) % IMAGE_SETS.length];
  const images = [...setA, ...setB.slice(0, 2)];
  return {
    ...room,
    desc: DEFAULT_DESC,
    images,
  };
}

export function enrichRooms(rooms: Room[]): EnrichedRoom[] {
  return rooms.map((r, idx) => enrichRoom(r, idx));
}
