import { extractPackage } from "../lib/extractPackage";

export default function Index() {
  return (
    <div >
      <h1>Discord Recap</h1>
      <input type="file" accept=".zip" onChange={(e) => extractPackage(e.target.files[0])}/>
    </div>
  );
}
