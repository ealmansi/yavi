package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.junit.Test
import org.scalatest.junit.JUnitSuite

import de.mpg.mpi.inf.d5.wiki.spark.JobContextMock
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RemovedOutlinks

/**
 * BuildTableRemovedOutlinksTest
 */
class BuildTableRemovedOutlinksTest extends JUnitSuite {
  @Test
  def testJob(): Unit = {
    // Run job on mock context.
    BuildTableRemovedOutlinks.runJob(JobContextMock)

    // Materialize result.
    JobContextMock.getDataFrame(RemovedOutlinks).show(1000)

    // Clear created tables.
    JobContextMock.clear()
  }
}
