import { JBrowseApp,createViewState } from '@jbrowse/react-app2';


const viewState = createViewState({
    config: {
        assemblies: [
            {
                name: 'hg38',
                sequence: {
                    trackId: 'GRCh38-ReferenceSequenceTrack',
                    type: 'ReferenceSequenceTrack',
                    adapter: {
                        type: 'BgzipFastaAdapter',
                        fastaLocation: {
                            uri: 'https://jbrowse.org/genomes/GRCh38/fasta/hg38.prefix.fa.gz',
                        },
                        faiLocation: {
                            uri: 'https://jbrowse.org/genomes/GRCh38/fasta/hg38.prefix.fa.gz.fai',
                        },
                    },
                },
                refNameAliases: {
                    adapter: {
                        type: 'RefNameAliasAdapter',
                        uri: 'https://jbrowse.org/genomes/GRCh38/hg38_aliases.txt',
                    },
                },
                cytobands: {
                    adapter: {
                        type: 'CytobandAdapter',
                        uri: 'https://jbrowse.org/genomes/GRCh38/cytoBand.txt',
                    },
                },
            },
        ],
        tracks: [
            {
                trackId: 'ncbi_genes',
                name: 'NCBI RefSeq Genes',
                type: 'FeatureTrack',
                assemblyNames: ['hg38'],
                adapter: {
                    type: 'Gff3TabixAdapter',
                    gffGzLocation: {
                        uri: 'https://jbrowse.org/genomes/GRCh38/ncbi_refseq/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz',
                    },
                },
            },
        ],
    }
});

export default function JBrowser() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <JBrowseApp viewState={viewState}/>
    </div>
  );
}