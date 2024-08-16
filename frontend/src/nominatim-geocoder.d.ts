declare module 'nominatim-geocoder' {
    interface GeocodeResult {
        place_id: number;
        licence: string;
        osm_type: string;
        osm_id: number;
        lat: string;
        lon: string;
        display_name: string;
        // Add other fields you may need from the API response
    }

    interface ReverseOptions {
        lat: number;
        lon: number;
    }

    class Geocoder {
        constructor(options?: object);

        reverse(options: ReverseOptions): Promise<GeocodeResult>;
        // Define other methods you might use from the library
    }

    export default Geocoder;
}
