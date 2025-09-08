import { Schema, model, Document } from 'mongoose';

/**
 * GeoJSON Polygon structure for coordinates.
 */
interface IPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

/**
 * Region document interface.
 */
export interface IRegion extends Document {
  name: string;
  coordinates: IPolygon;
}

const RegionSchema = new Schema<IRegion>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Polygon'],
        required: true,
      },
      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// 2dsphere index for geospatial queries
RegionSchema.index({ coordinates: '2dsphere' });

const Region = model<IRegion>('Region', RegionSchema);

export default Region;
