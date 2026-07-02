import {createClient} from "@supabase/supabase-js";
import AutocompleteInput from "@/components/AutocompleteInput";

const AutocompleteSystem = async () => {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! );

    const {data, error} = await sb.from('productions')
        .select( )


    if (error) console.error("Couldnt get productions:  err"  + JSON.stringify(error));

    console.log(data)

    return (
        <AutocompleteInput productions={data ?? []}></AutocompleteInput>
    )
}

export default AutocompleteSystem;