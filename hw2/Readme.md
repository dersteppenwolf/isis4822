# A Visual tool for Data Quality Checking of  Geomagnetic Data


**Url**:  https://beta.observablehq.com/@dersteppenwolf/a-visual-tool-for-data-quality-checking-of-geomagnetic-data

## About the Author 

**Author**: Juan Carlos Méndez.   

**Email**: jc.mendez[~at~]uniandes.edu.co , juan[~at~]gkudos.com

**Twitter**: @dersteppen

**Github**: https://github.com/dersteppenwolf


## About the Class 

**Class**: ISIS 4822: Visual Analytics ,  Fall 2018 http://johnguerra.co/classes/visual_analytics_fall_2018/

**Homework**: 2

**Slides**: (Pdf) https://github.com/dersteppenwolf/isis4822/blob/master/hw2/slides.hw2.jc.mendez_fall_2018.pdf


## Dataset Description

**Nombre del Dataset** : Componentes Geomagnéticas del Observatorio de Fúquene entre 1955 y 2014 

**Dataset Title** : Geomagnetic Components of the Fúquene Observatory between 1955 and 2014

**Url** : http://geoportal.igac.gov.co/es/contenido/datos-abiertos-geodesia    https://www.datos.gov.co/browse?anonymous=true&q=Instituto+Geogr%C3%A1fico+Agust%C3%ADn+Codazzi+&sortBy=newest&tags=campo+magn%C3%A9tico&utf8=%E2%9C%93

**Institution** : Instituto Geográfico Agustín Codazzi - IGAC ( https://www.igac.gov.co/ ) 

**Number of Rows** : 525.960

**Data Types** : Quantitative, temporal


## Context

***¿Qué es el geomagnetismo?***

*Tomado de (3)*

El geomagnetismo es la ciencia que estudia el origen, las propiedades y las variaciones del campo magnético terrestre. El campo magnético que se observa en un punto de la Tierra tiene dos orígenes, uno interno y otro externo. El campo de origen externo es debido principalmente a la actividad del Sol sobre la ionosfera y la magnetosfera. Este campo externo presenta variaciones periódicas siendo la más importante la variación diaria con período de 24 horas

El campo magnético terrestre es una magnitud de carácter vectorial, por lo que para estudiar sus componentes se toma como referencia en un punto de la superficie de la Tierra un sistema cartesiano de coordenadas XYZ de ejes en dirección N-S, E-O y vertical. De esta forma, la intensidad total del campo (F) y sus proyecciones horizontal (H) y vertical (Z) están relacionadas a través del ángulo de declinación (D) que forma H con el norte geográfico, y del ángulo de inclinación magnética (I) que forman F y H.

![alt text](https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/campo.png "Descomposición vectorial del Campo Magnético")


***What is geomagnetism?***

Geomagnetism is the science that studies the origin, properties and variations of the earth's magnetic field. The magnetic field that is observed in a point of the Earth has two origins, one internal and the other external. The field of external origin is mainly due to the activity of the Sun over the ionosphere and the magnetosphere. This external field presents periodic variations, the most important being the daily variation with a 24-hour period

The terrestrial magnetic field is a magnitude of vector character, so to study its components is taken as a reference point on the surface of the Earth a Cartesian system of XYZ coordinates of axes in direction N-S, E-O and vertical. In this way, the total intensity of the field (F) and its horizontal (H) and vertical (Z) projections are related through the declination angle (D) that forms H with the geographic north, and the angle of magnetic inclination ( I) that form F and H.



## The Problem

The dataset has a huge number of rows (525.960). The owner of data doesn't have a visual tool that let him easily check data quality  .

## The Solution

* Se creó una visualización interactiva utilizando d3 y observablehq que permite al usuario explorar los componentes geomagnéticos horizontal, vertical, declinación e intensidad total tanto de forma resumida por agregación por año, mes o día, así como también la exploración del detalle de la serie de tiempo para un día específico.

* An interactive visualization was created using d3 and observablehq that allows the user to explore the horizontal, vertical, declination and total intensity geomagnetic components in a summarized way by aggregation per year, month or day, as well as the exploration of the detail of the time series for a specific day.


## Insights

1. The user discovered some anomalies in the data using the interactive visualization. 
2. According to the owner of the data,  those anomalies were caused by errors during the process of the extraction and transformation  of  the original data.
3. The owner of the data will publish in the following days a new corrected version of the dataset 
4. The owner of data is considering to include visual tools like this in his daily work.



# References

1. D3 Line Chart by @mbostock  https://beta.observablehq.com/@mbostock/d3-line-chart 

2. Line Chart with Circle Tooltip D3 V4 by @alandunning https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3

3. Teoría de Geomagnetismo http://www.ign.es/web/resources/docs/IGNCnig/GMT-Teoria-Geomagnetismo.pdf

4. Automated Hardware and Software System for Monitoring the Earth’s Magnetic Environment https://datascience.codata.org/articles/10.5334/dsj-2016-018/


# Screenshots

![alt text](https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/images/s1.png "Visualization")

![alt text](https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/images/s_filter.png "Visualization")

![alt text](https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/images/s2.png "Visualization")

![alt text](https://raw.githubusercontent.com/dersteppenwolf/isis4822/master/hw2/images/s_detail.png "Visualization Detail")