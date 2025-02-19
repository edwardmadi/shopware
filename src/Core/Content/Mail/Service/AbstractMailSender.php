<?php declare(strict_types=1);

namespace Shopware\Core\Content\Mail\Service;

use Shopware\Core\Content\MailTemplate\Exception\MailTransportFailedException;
use Shopware\Core\Framework\Log\Package;
use Symfony\Component\Mailer\Envelope;
use Symfony\Component\Mime\Email;

#[Package('services-settings')]
abstract class AbstractMailSender
{
    abstract public function getDecorated(): AbstractMailSender;

    /**
     * @deprecated tag:v6.7.0 - Parameter $envelope will be removed
     *
     * @throws MailTransportFailedException
     */
    abstract public function send(Email $email, ?Envelope $envelope = null): void;
}
