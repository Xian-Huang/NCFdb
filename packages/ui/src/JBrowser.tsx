import { JBrowseApp,createViewState } from '@jbrowse/react-app2';


const viewState = createViewState({
    config: {
        assemblies: {
            name: 'hg38',
            sequence: {
                type: 'ReferenceSequenceTrack',
                trackId: 'GRCh38-ReferenceSequenceTrack',
                adapter: {
                    type: 'BgzipFastaAdapter',
                    uri: 'https://jbrowse.org/genomes/GRCh38/fasta/hg38.prefix.fa.gz',
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
        tracks: [
            {
                type: 'FeatureTrack',
                trackId: 'ncbi_genes',
                name: 'NCBI RefSeq Genes',
                assemblyNames: ['hg38'],
                adapter: {
                    type: 'Gff3TabixAdapter',
                    uri: 'https://jbrowse.org/genomes/GRCh38/ncbi_refseq/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz',
                },
            },
        ],
        defaultSession: {
            name: 'My session',
            view: {
                id: 'linearGenomeView',
                type: 'LinearGenomeView',
                init: {
                    assembly: 'hg38',
                    loc: '10:29,838,565..29,838,850',
                    tracks: ['ncbi_genes'],
                },
            },
        },
    }
});

export default function JBrowser() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <JBrowseApp viewState={viewState}/>
    </div>
  );
}