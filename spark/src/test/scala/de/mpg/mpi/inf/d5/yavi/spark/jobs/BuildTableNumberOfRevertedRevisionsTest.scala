package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.junit.Test
import org.scalatest.junit.JUnitSuite

import de.mpg.mpi.inf.d5.wiki.spark.JobContextMock
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfRevertedRevisions

/**
 * BuildTableNumberOfRevertedRevisionsTest
 */
class BuildTableNumberOfRevertedRevisionsTest extends JUnitSuite {
  @Test
  def testJob(): Unit = {
    // Run job on mock context.
    BuildTableNumberOfRevertedRevisions.runJob(JobContextMock)

    // Materialize result.
    JobContextMock.getDataFrame(NumberOfRevertedRevisions).show(1000)

    // Clear created tables.
    JobContextMock.clear()
  }
}
