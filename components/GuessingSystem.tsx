import {createClient} from "@supabase/supabase-js";

import GuessingForm from "@/components/GuessingForm";


const GuessingSystem = async () => {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! );


    const {data: productionData, error: errorData} = await sb.from('productions')
        .select( )

    const {data: imagesData, error: errorDataImages} = await sb.from('daily_images')
        .select("production_id").order('production_id', { ascending: false }).limit(1);

    if (errorData) console.error("Couldnt get productions:  err"  + JSON.stringify(errorData));
    if (errorDataImages) console.error("Couldnt get productions:  err"  + JSON.stringify(errorDataImages));

    const winningProductionId: {production_id : string} = imagesData![0];

    const handleSelect = (id: string) => {
      const idc = id;
    }
    console.log("Production ID: ", winningProductionId);



/// TODO 1 server parent 2 child client server przekazuje do childa co wygralo i dane  a child jako komponent wszstkiego czyl iinput button i tabelka sobie ogarnia

    return (
       <GuessingForm productions={productionData ?? []} winningProduction={winningProductionId.production_id}></GuessingForm>
    )
}

export default GuessingSystem;