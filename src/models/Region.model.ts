import { Schema, model, Document } from 'mongoose';

// Interface para o objeto GeoJSON Polygon
interface IPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // Array de anéis de coordenadas lineares
}

// Interface para o nosso documento de Região
export interface IRegion extends Document {
  name: string;
  coordinates: IPolygon;
}

const RegionSchema = new Schema<IRegion>({
  name: {
    type: String,
    required: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Polygon'], // 'coordinates' só pode ser do tipo Polygon
      required: true
    },
    coordinates: {
      type: [[[Number]]], // Array de anéis de [long, lat]
      required: true
    }
  }
});

// CRÍTICO: Crie o índice geoespacial
// Isso é o que permite que as queries de geolocalização sejam rápidas e eficientes.
RegionSchema.index({ coordinates: '2dsphere' });

const Region = model<IRegion>('Region', RegionSchema);

export default Region;