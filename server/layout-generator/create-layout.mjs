/*
const createLayout;
Creates a functional layout object of notes and images
Inputs: 
* pattern: a 2D array containing Note ObjectIDs

Output:
* Uploads a directory of DZI files to AWS S3 bucket
* Inserts a layout object to Mongo Atlas
* Returns the ObjectID of the newly inserted layout object

Side effects:
* Generates large temp files which are deleted upon program termination

*/
const createLayout = async (pattern,options) => {
    const layout = {
        name:options.name,
        rows:pattern.length,
        cols:pattern[0].length,
        NoteSize:288,
        array:pattern,
        dzi:null
    }

// 3. generate stitched image in temp folder

// 4. generate dzi in temp folder

// 5. upload all dzi files to s3

// 6. update layout object with dzi metadata and S3 URL

// 7. insert layout object to mongo atlas

// 8. delete temp files
}

export default createLayout;