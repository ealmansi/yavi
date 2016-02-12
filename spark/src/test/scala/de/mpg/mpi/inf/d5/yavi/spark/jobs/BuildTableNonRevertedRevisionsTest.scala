package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.junit.Test
import org.scalatest.junit.JUnitSuite

import de.mpg.mpi.inf.d5.wiki.spark.JobContextMock
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NonRevertedRevisions

/**
 * BuildTableNonRevertedRevisionsTest
 */
class BuildTableNonRevertedRevisionsTest extends JUnitSuite {
  @Test
  def testJob(): Unit = {
    // Run job on mock context.
    BuildTableNonRevertedRevisions.runJob(JobContextMock)

    // Materialize result.
    JobContextMock.getDataFrame(NonRevertedRevisions).show(1000)

    // Clear created tables.
    JobContextMock.clear()
  }
}
