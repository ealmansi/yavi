package de.mpg.mpi.inf.d5.yavi.server.providers;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class ProviderUtil {
  public static EntityManager getEntityManagerByWikipediaId(String wikipediaId) {
    String persistenceUnit = wikipediaId + "wiki";
    EntityManagerFactory entityManagerFactory =
        Persistence.createEntityManagerFactory(persistenceUnit);
    return entityManagerFactory.createEntityManager();
  }
}
