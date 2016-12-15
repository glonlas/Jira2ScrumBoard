<?php

namespace Tests\AgileStoryPrint\JiraBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Functional test that implements a "smoke test" of all the public and secure
 * URLs of the application.
 * See http://symfony.com/doc/current/best_practices/tests.html#functional-tests.
 *
 * Execute the application tests using this command (requires PHPUnit to be installed):
 *
 *     $ phpunit tests/AgileStoryPrint/JiraBundle/Controller/DefaultControllerTest.php
 */
class DefaultControllerTest extends WebTestCase
{
    public function getPublicUrls()
    {
        // English
        yield ['/'];
        yield ['/print-your-index-cards.html'];
        yield ['/no-stories-found.html'];
        yield ['/wrong-file.html'];
        yield ['/contact.html'];
        yield ['/cookie-policy.html'];
        yield ['/terms-of-use.html'];
        yield ['/error/404.html'];
        yield ['/error/500.html'];
        
        // French
        yield ['/fr/'];
        yield ['/fr/imprimez-vos-index-cards.html'];
        yield ['/fr/pas-de-story-trouve.html'];
        yield ['/fr/mauvais-fichier.html'];
        yield ['/fr/contact.html'];
        yield ['/fr/usage-des-cookies.html'];
        yield ['/fr/conditions-generale.html'];
        yield ['/fr/erreur/404.html'];
        yield ['/fr/erreur/500.html'];

        // Dutch
        yield ['/nl/'];
        yield ['/nl/print-your-index-cards.html'];
        yield ['/nl/no-stories-found.html'];
        yield ['/nl/wrong-file.html'];
        yield ['/nl/contact.html'];
        yield ['/nl/cookie-policy.html'];
        yield ['/nl/terms-of-use.html'];
        yield ['/nl/error/404.html'];
        yield ['/nl/error/500.html'];

        // Chinese Mandarin
        yield ['/zh/'];
        yield ['/zh/print-your-index-cards.html'];
        yield ['/zh/没有发现任何故事在您的文件中.html'];
        yield ['/zh/上传的文件有错误.html'];
        yield ['/zh/联系方式.html'];
        yield ['/zh/cookie-声明.html'];
        yield ['/zh/使用条款.html'];
        yield ['/zh/错误/400.html'];
        yield ['/zh/错误/500.html'];

        // German
        yield ['/de/'];
        yield ['/de/print-your-index-cards.html'];
        yield ['/de/no-stories-found.html'];
        yield ['/de/wrong-file.html'];
        yield ['/de/contact.html'];
        yield ['/de/cookie-policy.html'];
        yield ['/de/terms-of-use.html'];
        yield ['/de/error/404.html'];
        yield ['/de/error/500.html'];

        // Spanish
        yield ['/es/'];
        yield ['/es/print-your-index-cards.html'];
        yield ['/es/no-stories-found.html'];
        yield ['/es/wrong-file.html'];
        yield ['/es/contact.html'];
        yield ['/es/politica-de-cookies.html'];
        yield ['/es/condiciones-de-uso.html'];
        yield ['/es/error/404.html'];
        yield ['/es/error/500.html'];

        // Italian
        yield ['/it/'];
        yield ['/it/print-your-index-cards.html'];
        yield ['/it/no-stories-found.html'];
        yield ['/it/wrong-file.html'];
        yield ['/it/contact.html'];
        yield ['/it/cookie-policy.html'];
        yield ['/it/terms-of-use.html'];
        yield ['/it/error/404.html'];
        yield ['/it/error/500.html'];
    }

    /**
     * PHPUnit's data providers allow to execute the same tests repeated times
     * using a different set of data each time.
     * See http://symfony.com/doc/current/cookbook/form/unit_testing.html#testing-against-different-sets-of-data.
     *
     * @dataProvider getPublicUrls
     */
    public function testPublicUrls($url)
    {
        $client = self::createClient();
        $client->request('GET', $url);

        $this->assertTrue(
            $client->getResponse()->isSuccessful(),
            sprintf('The %s public URL loads correctly.', $url)
        );
    }

    public function testIndex()
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');

        $this->assertCount(
            1,
            $crawler->filter('#quick-upload'),
            'The upload form is present'
        );

        $this->assertCount(
            1,
            $crawler->filter('form #uploadStories_file'),
            'The upload form is present'
        );

        $this->assertCount(
            4,
            $crawler->filter('section'),
            'The homepage displays the right number of sections.'
        );

        $this->assertCount(
            1,
            $crawler->filter('section#services'),
            'Section #services is present'
        );

        $this->assertCount(
            1,
            $crawler->filter('section#faq'),
            'Section #faq is present'
        );

        $this->assertCount(
            1,
            $crawler->filter('section#author'),
            'Section #author is present'
        );

        $this->assertCount(
            1,
            $crawler->filter('section#contact'),
            'Section #contact is present'
        );

        $this->assertCount(
            1,
            $crawler->filter('form#contactForm'),
            'The contact form is present'
        );
    }

    public function testAlternateLang()
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');

        $this->assertCount(
            4,
            $crawler->filter('link[rel~="alternate"]'),
            'The upload form is present'
        );

        $lang = $crawler->filter('link[rel~="alternate"]')->eq(0);
        $this->assertEquals(
            'http://www.jira2scrumboard.com.com/',
            $lang->attr('href'),
            'Alternate: English URL is present'
        );
        $this->assertEquals(
            'en',
            $lang->attr('hreflang'),
            'Alternate: English hreflang is present'
        );

        $lang = $crawler->filter('link[rel~="alternate"]')->eq(1);
        $this->assertEquals(
            'http://www.jira2scrumboard.com.com/fr/',
            $lang->attr('href'),
            'Alternate: French URL is present'
        );
        $this->assertEquals(
            'fr',
            $lang->attr('hreflang'),
            'Alternate: French hreflang is present'
        );

        $lang = $crawler->filter('link[rel~="alternate"]')->eq(2);
        $this->assertEquals(
            'http://www.jira2scrumboard.com.com/zh/',
            $lang->attr('href'),
            'Alternate: Chinese URL is good'
        );
        $this->assertEquals(
            'zh',
            $lang->attr('hreflang'),
            'Alternate: Chinese hreflang is good'
        );


        $lang = $crawler->filter('link[rel~="alternate"]')->eq(3);
        $this->assertEquals(
            'http://www.jira2scrumboard.com.com/nl/',
            $lang->attr('href'),
            'Alternate: Dutch URL is present'
        );
        $this->assertEquals(
            'nl',
            $lang->attr('hreflang'),
            'Alternate: Dutch hreflang is present'
        );
    }
}