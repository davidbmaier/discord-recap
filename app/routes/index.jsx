import { extractPackage } from "../lib/extract";
import { collectStats } from "../lib/stats";
import { storeStats } from "../lib/store";

const handlePackage = async (file) => {
  try {
    const extractedPackage = await extractPackage(file);
    const stats = await collectStats(extractedPackage);
    storeStats(stats);
    window.location.href = "/stats";
  } catch (error) {
    // TODO: use a proper error boundary
    console.log('error', error);
  }
}

export default function Index() {
  return (
    <div >
      <h1>Discord Recap</h1>
      <input type="file" accept=".zip" onChange={(e) => handlePackage(e.target.files[0])}/>
    </div>
  );
};
