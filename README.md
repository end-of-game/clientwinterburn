# Prise en main de l’outil de génération de template JSF/Spring/JPA avec WinterBurn v.0.0.1


## Objectif du projet

L’outil de génération de code Winterburn s’appuie sur la technologie de l’Annotation Processing apparu en Java 1.5 pour générer automatiquement sur la base d’un modèle (template) les fichiers JAVA et les pages Web nécessaires au fonctionnement d’une application Web avec le système d’injection Spring 3, le système de persistence JPA et une Interface de présentation en JSF 2. Destiné aux développeurs souhaitant mettre en place rapidement un projet s’appuyant sur ces technologies, il leur permettra de créer toute l’architecture de leur application (couches Service, DAO, Controllers et pages XHTML) de façon automatique, et cela, en ajoutant une simple annotation (ici l’annotation @Entity de javax.persistence)  sur leurs objets modèles.

L’ensemble des fichiers JAVA générés contient le code nécessaire à l’exécution des méthodes du C.R.U.D (sauvegarder, supprimer et lister les entités). Une page XHTML contenant un formulaire de saisie de l’entité et la liste de toutes les entités en base est également générées. Une prochaine version permettra notamment de charger directement le template de la page web depuis le projet client, ce qui permettra au développeur de personnaliser directement son projet au travers du client.

L’utilisation d’un tel outil permet un gain de temps indéniable pour le développeur dans la mesure où l’ensemble des fichiers intermédiaires sont générées automatiquement lorsqu’il sauvegarde un objet JAVA annoté avec @Entity. Tout le code générique ne nécessitant pas une réelle réflexion et bien souvent long à copier. 

## Prise en main du logiciel

### 1 - Pré-requis

Afin d’avoir un fonctionnement optimal de votre outil de génération de code, vous devez vous équiper (sur un système d’exploitation Linux ou Windows XP et ultérieur) :

- Java Kit Development 1.7
- Apache Maven 3.05
- Eclipse Juno avec le plugin JBoss Developer


### 2 - Installation d'un projet Spring/JSF/JPA avec Maven et l'outil de génération

Tout d'abord, télécharger le processor WinterBurn.
		
Une fois le projet téléchargé, packager l'application dans un fichier .jar puis l'ajouter au repository Maven en exécutant la commande suivante (se placer dans le répertoire contenant le .jar « winterburn ») :

mvn install:install-file -Dfile=winterburn.jar -DgroupId=fr.treeptik -DartifactId=winterburn -Dversion=0.0.1.SNAPSHOT -Dpackaging=jar

 ```bash
stagiaire@stagiaire-W240EU-W250EUQ-W270EUQ:~/winterburn$ mvn install:install-file -Dfile=winterburn.jar -DgroupId=fr.treeptik -DartifactId=winterburn -Dversion=0.0.1.SNAPSHOT -Dpackaging=jar
[INFO] Scanning for projects...
[INFO]                                                                         
[INFO] ------------------------------------------------------------------------
[INFO] Building winterburn 0.0.1-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO] 
[INFO] --- maven-install-plugin:2.3.1:install-file (default-cli) @ winterburn ---
[INFO] Installing /home/stagiaire/winterburn/winterburn.jar to /home/stagiaire/.m2/repository/fr/treeptik/winterburn/0.0.1.SNAPSHOT/winterburn-0.0.1.SNAPSHOT.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 0.996s
[INFO] Finished at: Thu May 30 14:44:09 CEST 2013
[INFO] Final Memory: 5M/118M
[INFO] ------------------------------------------------------------------------
 ```


A présent, télécharger le client Spring/JPA/JSF et ajouter le en tant que projet Maven dans votre environnement de développement (nous utiliserons ici Eclipse Juno avec le plugin JBOSS Developer qui fournit Maven 3 et eGit pour Eclipse).

Dans le client, vérifier la présence du fichier de configuration winterburnContext.properties dans « src/main/resources » :
 
 ``` properties

packageName=fr.treeptik
packageToScan=fr.treeptik.model
packageService=service
packageInterfaceDAO=dao
packageController=controller
dependencyInjection=spring
persistenceAPI=jpa
ihm=jsf

 ```

Vous pourrez configurer ici le nom de la racine commune à tous les packages, le package à scanner par le processor, le nom des différentes couches de l'application (controller, service, dao...) ainsi que les technologies utilisées (les seules technologies implémentées pour le moment sont mises par défaut). Il faut absolument que le nom du package commun soit le même que celui du package scanné par le contexte spring (dans le fichier applicationContext.xml) présent ici dans le « src/main/resources/profiles/development/WEB-INF ».

 ```xml

<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tx="http://www.springframework.org/schema/tx"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:jee="http://www.springframework.org/schema/jee" xmlns:lang="http://www.springframework.org/schema/lang"
	xmlns:p="http://www.springframework.org/schema/p" xmlns:security="http://www.springframework.org/schema/security"
	xmlns:jdbc="http://www.springframework.org/schema/jdbc" xmlns:aop="http://www.springframework.org/schema/aop"
	xmlns:util="http://www.springframework.org/schema/util"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
 
	http://www.springframework.org/schema/beans/spring-beans.xsd
	http://www.springframework.org/schema/tx
	http://www.springframework.org/schema/tx/spring-tx.xsd
	http://www.springframework.org/schema/lang
	http://www.springframework.org/schema/lang/spring-lang.xsd
	http://www.springframework.org/schema/jee
	http://www.springframework.org/schema/jee/spring-jee.xsd
	http://www.springframework.org/schema/aop
	http://www.springframework.org/schema/aop/spring-aop.xsd
	http://www.springframework.org/schema/security
	http://www.springframework.org/schema/security/spring-security.xsd
	http://www.springframework.org/schema/util
	http://www.springframework.org/schema/util/spring-util.xsd 
	http://www.springframework.org/schema/context
	http://www.springframework.org/schema/context/spring-context.xsd
	http://www.springframework.org/schema/jdbc http://www.springframework.org/schema/jdbc/spring-jdbc.xsd">

	<context:annotation-config />

	<context:component-scan base-package="fr.treeptik" />

	<jdbc:initialize-database data-source="dataSource">

        ....

</beans>

 ```


Le processor configuré, on peut commencer à éditer nos classes entités. Celles-ci doivent être placées impérativement dans le package défini par la configuration « packageToScan » afin d'être prises en compte par le processor. 
Veillez à bien renseigné l'id (avec l'annotation @Id) pour que l'entité soit prise en charge par JPA. Puis, toutes les données membres la caractérisant sans oublier les getters et les setters ainsi que le ou les constructeur(s) (par défaut, sans paramètre). 
L'entité peut éventuellement implémenter Serializable : 

 ``` java

package fr.treeptik.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
@Entity
public class Personne implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	private Integer id;

	private String nom;

	private String prenom;

	private Integer adresse;

	public Personne() {
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public Integer getAdresse() {
		return adresse;
	}

	public void setAdresse(Integer adresse) {
		this.adresse = adresse;
	}

}

 ```

Une fois la classe complétée, ajoutez l'annotation @Entity de la librairie javax.persistence et sauvegardez.
En rafraîchissant votre workspace, vous verrez l'ensemble des classes générées spécifiques à votre entité, à savoir :

- l'interface DAO :

``` java

package fr.treeptik.dao;

import fr.treeptik.model.Personne;
import java.util.List;

import fr.treeptik.exception.DAOException;

public interface PersonneDAO {

	Personne save (Personne personne) throws DAOException;
	
	void delete (Personne personne) throws DAOException;
	
	List<Personne> findAll() throws DAOException;
   
}

 ```

- l'implémentation du DAO, à savoir ici JPA :

``` java

package fr.treeptik.jpa.dao;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.apache.log4j.Logger;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.persistence.TypedQuery;

import fr.treeptik.exception.DAOException;

import fr.treeptik.model.Personne;
import fr.treeptik.dao.PersonneDAO;



@Repository
public class PersonneJPADAO implements PersonneDAO{

	private Logger logger = Logger.getLogger(PersonneJPADAO.class);
	//fields
	@PersistenceContext
	private EntityManager entityManager;

	//methods
	
	public Personne save (Personne personne) throws DAOException {
		try	{
		entityManager.persist(personne);
		}
		catch (PersistenceException e) {
			throw new DAOException("Erreur création personne",e);
			}	
		return personne;
	}
	
	public void delete (Personne personne) throws DAOException {
		try	{
		entityManager.remove(personne);
		}
		catch (PersistenceException e) {
			throw new DAOException("Erreur suppression personne",e);
		}
	}
	
	public List<Personne> findAll() throws DAOException {
	TypedQuery<Personne> query;
		try	{
			 query = entityManager.createQuery(
				"Select e from Personne e ", Personne.class);
				} catch (PersistenceException e) {
			throw new DAOException("Erreur lister",e);
		}
		return query.getResultList();
	}
   
}

```

- la couche service :


``` java

package fr.treeptik.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import fr.treeptik.exception.DAOException;
import fr.treeptik.exception.ServiceException;
import fr.treeptik.model.Personne;
import fr.treeptik.dao.PersonneDAO;
import org.apache.log4j.Logger;

@Service
public class PersonneService {
	
	private Logger logger = Logger.getLogger(PersonneService.class);
	
	//fields
	@Autowired
	private PersonneDAO personneDAO;

	//methods
	
	@Transactional
	public Personne save (Personne personne) throws ServiceException{
		try {
		return personneDAO.save(personne);
		} catch (DAOException e) {
			throw new ServiceException("Erreur methode save ", e);
		}
	}
	@Transactional
	public void delete (Personne personne) throws ServiceException{
		try {
		personneDAO.delete(personne);
		} catch (DAOException e) {
			throw new ServiceException("Erreur methode delete ", e);
		}
	}
	
	public List<Personne> findAll() throws ServiceException{
		List<Personne> list;
		try {
		list = personneDAO.findAll();
		} catch (DAOException e) {
			throw new ServiceException("Erreur methode list ", e);
		}
	return list;
	}
   
}
```


- le controller :


``` java

package fr.treeptik.controller;

import java.io.Serializable;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.SessionScoped;
import javax.faces.model.ListDataModel;
import org.apache.log4j.Logger;


import fr.treeptik.exception.ServiceException;
import fr.treeptik.model.Personne;
import fr.treeptik.service.PersonneService;


@ManagedBean()
@SessionScoped
public class PersonneController implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private Logger logger = Logger.getLogger(PersonneController.class);
	
	private Personne personne = new Personne();
	
	private ListDataModel<Personne> personnes = new ListDataModel<Personne>();
	
	@ManagedProperty(value= "#{personneService}")
	private PersonneService  personneService;
	
	//Methods
	
	public String save() throws ServiceException{
	personne = personneService.save(personne);
	personne = new Personne();
	return "personne";
	}
	
	public ListDataModel<Personne> getPersonnes() throws ServiceException {
	personnes.setWrappedData(personneService.findAll());
	return personnes;
	}
	
	//Getters & Setters
	
	public Personne getPersonne(){
		return personne;
	}
	
	public void setPersonne(Personne personne){
		this.personne = personne;
	}
	
	public PersonneService getPersonneService(){
		return personneService;
	}
	
	public void setPersonneService(PersonneService personneService){
		this.personneService = personneService;
	}
	
}
```

Vous verrez également que le processor a également généré une page de démonstration par défaut contenant une formulaire de saisie des données membres de l'entité et la liste de l'ensemble des données en base.

``` html

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:h="http://java.sun.com/jsf/html"
	xmlns:f="http://java.sun.com/jsf/core"
	xmlns:ui="http://java.sun.com/jsf/facelets">

<ui:composition template="/template/main.xhtml">

	<ui:param name="personne" value="active"></ui:param>


	<ui:define name="body">

		<h1>Créer un(e) personne</h1>
		
		<h:form>
		
				
		<div class="control-group">
		<label class="control-label">prenom</label>
			<div class="controls">
		
		<h:inputText value="#{personneController.personne.prenom}" styleClass="input input-large" />
		
			</div>
		</div>
		<div class="control-group">
		<label class="control-label">nom</label>
			<div class="controls">
		
		<h:inputText value="#{personneController.personne.nom}" styleClass="input input-large" />
		
			</div>
		</div>
		<div class="control-group">
					<h:commandButton action="#{personneController.save()}"
						value="Enregistrer"
						styleClass="btn btn-large btn-info" />
				</div>
			

	</h:form>
	<h1>Liste des personnes</h1>
	<h:dataTable styleClass="table table-index"
						value="#{personneController.personnes}" var="personne1">
					<h:column>
    				
    				<f:facet name="header">prenom</f:facet>
    				
    				#{personne1.prenom}
    				
    			</h:column>
    			
					<h:column>
    				
    				<f:facet name="header">nom</f:facet>
    				
    				#{personne1.nom}
    				
    			</h:column>
    			
	</h:dataTable>
	
	</ui:define>
</ui:composition>

</html>

```
Avant de lancer votre application dans un serveur Tomcat 7, veillez à bien créer la base dans MySQL avec le même nom que celui de la datasource définie dans le fichier « context.xml » situé dans « src/main/resources/profiles/development/ META-INF » :

 ``` xml

<?xml version="1.0" encoding="UTF-8"?>
<Context>
	<!-- disable storage of sessions across restarts -->
	<Manager pathname="" />
	<Manager pathname="" />
	<Resource name="jdbc/MysqlDS" auth="Container"
		type="javax.sql.DataSource" maxActive="100" maxIdle="30" maxWait="10000"
		username="root" password="root"
		driverClassName="com.mysql.jdbc.Driver"
		url="jdbc:mysql://localhost:3306/orunitia" />
	<Resource name="BeanManager" auth="Container"
		type="javax.enterprise.inject.spi.BeanManager" factory="org.jboss.weld.resources.ManagerObjectFactory" />
	<Resource name="BeanManager" auth="Container"
		type="javax.enterprise.inject.spi.BeanManager" factory="org.jboss.weld.resources.ManagerObjectFactory" />
	<!-- Uncomment to enable injection into Servlets, Servlet Listeners and 
		Filters in Tomcat -->
	<!-- <Listener className="org.jboss.weld.environment.tomcat.WeldLifecycleListener"/> -->
</Context>
 ```


Vous pouvez ensuite lancer l'application et afficher les pages générées.
Notez que le processor ne générera pas de page ou de fichier JAVA si celle-ci existe dans les sources de l'application à l'emplacement où elle doit se trouver.
Ainsi, il n'y a aucun risque que les modifications apportées aux fichiers soient réécrasées. Cependant, si vous supprimez un fichier, le processor généra automatiquement le fichier manquant tel qu'il avait été créé initialement.

## La vidéo de démonstration (par Hervé Fontbonne) :

[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](http://www.youtube.com/watch?v=3mMtUV_WIP8)



