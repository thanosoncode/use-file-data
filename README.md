# useFileData hook

A custom React hook that retrieves file data from input changes.

```ts
// Import useFileData
import { useFileData } from 'use-file-data';

// Add {...register} to your input
<input type="file" multiple {...register} />;

// Get items with data
useFileData({
  ref: inputRef,
  onSuccess: (items) => setPreviewItems(items),
});
```

<br/>

## API

<h3>useFileData(options: Object): Object</h3>

- register : An object with props to pass to your input. (ref, onChange, accept)
- imageTypes (optional): An array of supported image MIME types that will be used to fill the accept prop. Defaults to an empty array.
- onSuccess (optional): A callback function called with the resulting file items after successful file processing.
- onError (optional): A callback function called when an error occurs during file processing or incorrect image MIME types.

<h3>The useFileData hook returns an object with the following properties: </h3>

- isLoadingPreviews: A boolean indicating if file previews are currently being loaded.
- error: The error object or string if an error occurred during file processing.
- isError: A boolean indicating if an error occurred.
- result: An array of file items containing the file, id, and the created data properties.

<br/>

## Complete example

```ts
import { useState } from 'react';
import { useFileData } from './useFileData';

type Item = { file: File; id: number; data: string };

const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const App = () => {
  const [previewItems, setPreviewItems] = useState<Item[]>([]);

  const { isLoadingPreviews, error, isError, register } = useFileData({
    imageTypes: imageMimeTypes,
    onSucess: (items) => setPreviewItems(items),
    onError: (error) => console.log(error),
  });

  if (isLoadingPreviews) {
    return <div>Loading previews...</div>;
  }

  if (isError) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {previewItems.length > 0 ? (
        <div>
          {previewItems.map((item) => (
            <img key={item.id} src={item.data} alt={item.file.name} />
          ))}
        </div>
      ) : null}
      <input type="file" multiple {...register} />
    </div>
  );
};

export default App;
```
