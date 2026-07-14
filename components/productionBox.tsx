import {supabaseNormalClient} from "@/utils/supabase/supabaseClients";
import Gallery from "./Gallery";

type ImageDetails = {
    url: string;
    nazwa: string;
};

type dailyImage = {
    day: string;
    image1: ImageDetails;
    image2: ImageDetails;
    image3: ImageDetails;
    image4: ImageDetails;
    image5: ImageDetails;
};

const ProductionBox = async () => {
    const sb = await supabaseNormalClient()


    const {
        data,
        error
    } = await sb.from('daily_images').select("day, image1, image2, image3, image4, image5",).order('day', {ascending: false}).limit(1).single();

    // potem await sb.from('daily_images').select().eq('day', new Date().toISOString().split('T')[0]).single();

    if (error) {
        console.error("Couldnt get productions: err" + JSON.stringify(error));
        return <p>Could not load productions.</p>;
    }

    if (!data) {
        return <p>No productions found.</p>;
    }

    const rawItem = data
    const parsed: dailyImage = {
        day: rawItem.day,
        image1: rawItem.image1 as ImageDetails,
        image2: rawItem.image2 as ImageDetails,
        image3: rawItem.image3 as ImageDetails,
        image4: rawItem.image4 as ImageDetails,
        image5: rawItem.image5 as ImageDetails,
    };


    const images = [
        parsed.image1,
        parsed.image2,
        parsed.image3,
        parsed.image4,
        parsed.image5,
    ];

    return <Gallery images={images}/>;

}

export default ProductionBox;