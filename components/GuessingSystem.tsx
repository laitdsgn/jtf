import {createClient} from "@supabase/supabase-js";

import GuessingForm from "@/components/GuessingForm";


const GuessingSystem = async () => {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);


    const {data: productionData, error: errorData} = await sb.from('productions')
        .select()

    const {data: imagesData, error: errorDataImages} = await sb.from('daily_images')
        .select("production_id").order('production_id', {ascending: false}).limit(1);

    const {
        data: winningProductionData,
        error: errorWinningProduction
    } = await sb.from('productions').select("production_type, production_title, production_release").eq("id", imagesData![0].production_id).single();

    if (errorData) console.error("Couldnt get productions:  err" + JSON.stringify(errorData));
    if (errorDataImages) console.error("Couldnt get productions:  err" + JSON.stringify(errorDataImages));
    if (errorWinningProduction) console.error("Couldnt get productions:  err" + JSON.stringify(errorWinningProduction));

    const winningProductionDataParsed: {
        production_type: "film" | "serial",
        production_title: { "en": string, "pl": string },
        production_release: string,
    } = winningProductionData!;

    const winningProductionID: string = imagesData![0].production_id;

// TODO 1 server parent 2 child client server przekazuje do childa co wygralo i dane  a child jako komponent wszstkiego czyl iinput button i tabelka sobie ogarnia

    return (
        <GuessingForm productions={productionData ?? []}
                      winningProductionData={winningProductionDataParsed}
                      winningProductionID={winningProductionID}></GuessingForm>
    )
}

export default GuessingSystem;