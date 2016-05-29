package de.mpg.mpi.inf.d5.yavi.wikipedia.export;

import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.inf.ArgumentParser;
import net.sourceforge.argparse4j.inf.ArgumentParserException;
import net.sourceforge.argparse4j.inf.Namespace;
import org.xml.sax.InputSource;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportException;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportHandler;
import de.mpg.mpi.inf.d5.wikipedia.export.WikipediaExportParser;

/**
 * YaviRevisionMetadataExport
 */
public class YaviRevisionMetadataExport {
  private static final ArgumentParser argParser;

  static {
    argParser =
        ArgumentParsers
            .newArgumentParser(YaviRevisionMetadataExport.class.getSimpleName().toLowerCase())
            .description("A tool for parsing Wikipedia XML dumps into Avro format.")
            .epilog("Reads from standard input, expecting XML from a stub history Wikipedia dump.\n" +
                        "\tOutputs a file with an avro collection of revision metadata.");
    argParser
        .addArgument("-o", "--revision-metadata-output-file")
        .required(true)
        .type(String.class)
        .help("File where the avro collection of revision metadata will be stored.");
  }

  public static void main(String[] args) throws WikipediaExportException, IOException {
    // Read command-line arguments.
    String revisionMetadataOutputFile = null;
    try {
      Namespace namespace = argParser.parseArgs(args);
      revisionMetadataOutputFile = namespace.get("revision_metadata_output_file");
    } catch (ArgumentParserException e) {
      argParser.handleError(e);
      System.exit(1);
    }

    // Generate input source from stdin.
    BufferedInputStream stdinBufferedInputStream = new BufferedInputStream(System.in);
    Reader stdinReader = new InputStreamReader(stdinBufferedInputStream);
    InputSource stdinInputSource = new InputSource(stdinReader);

    // Generate export handler and run parser.
    WikipediaExportHandler exportHandler =
        new YaviRevisionMetadataExportHandler(revisionMetadataOutputFile);
    WikipediaExportParser.parse(stdinInputSource, exportHandler);
  }
}
