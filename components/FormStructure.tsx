import Navbar from "./Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LinkForm from "./LinkForm";
import { LinkSchema } from "@/lib/validations";
import { Id } from "@/convex/_generated/dataModel";
interface FormStructureProps{
  _id?:Id<'links'>;
  title?:string;
  url?:string;
  note?:string;
  createdAt?:number;
}
const FormStructure = ({initialData}:{initialData?:FormStructureProps}) => {
return (
  <div className="min-h-screen bg-gray-50">
    <Navbar/>
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to links
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Link
          </h1>
          <p className="text-gray-500 mt-1">
            Save a new link with a title and optional note
          </p>
        </div>

        <LinkForm initialData={initialData || undefined} />
      </div>
    </main>
  </div>
)
}
export default FormStructure;