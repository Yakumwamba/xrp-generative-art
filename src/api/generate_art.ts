// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
//import { createClient } from '@supabase/supabase-js'
type GeneratedImage = {
  imageURL: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeneratedImage>
) {

    //const supabase = createClient('https://lqmvvslhcfindyifblyk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbXZ2c2xoY2ZpbmR5aWZibHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk0MjY3ODUsImV4cCI6MTk4NTAwMjc4NX0.ElePLMRZGn4pkHac0ZQj7AfHnGXWGBLaQbs_uyJ9pW0')

    //curl https://api.openai.com/v1/images/generations \
//   -H 'Content-Type: application/json' \
//   -H "Authorization: Bearer $OPENAI_API_KEY" \
//   -d '{
//     "prompt": "a white siamese cat",
//     "n": 1,
//     "size": "1024x1024"
//   }'

    if (req.method === 'POST') {
        // Process a POST request
        console.log(req.body);
        //const { data, error } = await supabase.storage.createBucket('avatars')

              const imageResp = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: req.body,
                    n: 1,
                    size: '1024x1024'
                }),
                headers: {
                    'Content-Type': 'application/json',
                    // use env variable for this
                    'Authorization': 'Bearer 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',
                }
        })

        const image = await imageResp.json();



//         console.log(image.data[0].url);
//         let blob = await fetch(image.data[0].url)
//         let blobData = await blob.blob()
//         let uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//         const resp = await supabase.storage

//         .from('generative-art')
//         .upload(`public/${uuid}.png`,    blobData)

        //create a signed url for the image


        //console.log("https://lqmvvslhcfindyifblyk.supabase.co/storage/v1/object/", resp.data?.path);
        res.status(200).json({ imageURL: image.data[0].url });

        //https://lqmvvslhcfindyifblyk.supabase.co/storage/v1/object/public/generative-art/public/y1izesg4z2v6udmpwu4h.png
      } else {

        const responseBlob = await fetch("https://oaidalleapiprodscus.blob.core.windows.net/private/org-MY9L6kQxZ3NhyCkaStj6nZ42/user-8GjBkyE6EkXgFQyBpJgOCoDo/img-OFBU4IRIja4BqzAbeET6EO8b.png?st=2022-12-04T18%3A19%3A03Z&se=2022-12-04T20%3A19%3A03Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-12-04T12%3A45%3A50Z&ske=2022-12-05T12%3A45%3A50Z&sks=b&skv=2021-08-06&sig=6g2RwXW7n2MV07IYEwbO4x1xwkaToYH0asNENXXGVw0%3D")
        const image = await responseBlob.json();
            console.log(image);
      
        // Handle any other HTTP method
        res.status(200).json({ imageURL: "Get requessdsdtsadasd detected" });
      }

}
