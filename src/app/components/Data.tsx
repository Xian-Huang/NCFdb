import { Download, Search, Database, FileText } from "lucide-react";

export function Data() {
  const datasets = [
    {
      title: "Reference Genome Assembly",
      version: "HanXRQr2.0-SUNRISE",
      size: "3.5 Gb",
      format: "FASTA",
      description: "High-quality reference genome assembly with chromosome-level scaffolds",
      downloads: "12,543",
    },
    {
      title: "Gene Annotations",
      version: "v2.1",
      size: "156 MB",
      format: "GFF3",
      description: "Comprehensive gene structure and functional annotations",
      downloads: "8,721",
    },
    {
      title: "Transcriptome Data",
      version: "Multi-tissue RNA-seq",
      size: "2.3 TB",
      format: "BAM/FastQ",
      description: "RNA-seq data from 15 different tissue types and developmental stages",
      downloads: "4,932",
    },
    {
      title: "Protein Sequences",
      version: "v2.1",
      size: "89 MB",
      format: "FASTA",
      description: "Predicted protein sequences for all annotated genes",
      downloads: "9,456",
    },
    {
      title: "Genetic Variants",
      version: "Pan-genome v1.0",
      size: "1.2 GB",
      format: "VCF",
      description: "SNPs and structural variants from 500+ sunflower accessions",
      downloads: "3,214",
    },
    {
      title: "Metabolomics Data",
      version: "Seed composition",
      size: "45 MB",
      format: "CSV/Excel",
      description: "Metabolite profiles and oil composition data",
      downloads: "2,187",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Genomic Data Repository</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Access and download comprehensive sunflower genomic datasets, including reference genomes, annotations, expression data, and more
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 border border-gray-200">
        <div className="flex items-center">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search datasets by keyword, version, or format..."
            className="flex-1 outline-none text-gray-700"
          />
          <button className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <Database className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">6</div>
          <div className="text-sm text-gray-600">Datasets</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <FileText className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">7.2 TB</div>
          <div className="text-sm text-gray-600">Total Data</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <Download className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">41K+</div>
          <div className="text-sm text-gray-600">Downloads</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-2xl font-bold">52,232</div>
          <div className="text-sm text-gray-600">Genes</div>
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Available Datasets</h2>
        {datasets.map((dataset, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{dataset.title}</h3>
                <div className="flex flex-wrap gap-3 mb-3">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {dataset.version}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {dataset.format}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {dataset.size}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{dataset.description}</p>
                <div className="text-sm text-gray-500">
                  {dataset.downloads} downloads
                </div>
              </div>
              <button className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors ml-4">
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Data Access Notice */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">Data Usage Policy</h3>
        <p className="text-blue-800">
          All data is freely available for research and educational purposes. We kindly ask users to cite the appropriate publications when using these datasets. For commercial use, please contact us for licensing information.
        </p>
      </div>
    </div>
  );
}
