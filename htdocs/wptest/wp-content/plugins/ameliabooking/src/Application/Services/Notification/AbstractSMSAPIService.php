<?php
/**
 * @copyright © TMS-Plugins. All rights reserved.
 * @licence   See LICENCE.md for license details.
 */

namespace AmeliaBooking\Application\Services\Notification;

use AmeliaBooking\Application\Services\Placeholder\PlaceholderService;
use AmeliaBooking\Domain\Services\Notification\SMSAPIServiceInterface;
use AmeliaBooking\Domain\Services\Settings\SettingsService;
use AmeliaBooking\Domain\ValueObjects\String\NotificationSendTo;
use AmeliaBooking\Infrastructure\Common\Container;
use AmeliaBooking\Infrastructure\Common\Exceptions\NotFoundException;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use Interop\Container\Exception\ContainerException;

/**
 * Class AbstractSMSAPIService
 *
 * @package AmeliaBooking\Application\Services\Notification
 */
abstract class AbstractSMSAPIService implements SMSAPIServiceInterface
{
    /** @var string */
    const STATUS_STRING_OK = 'OK';

    /** @var Container */
    protected $container;

    /**
     * ProviderApplicationService constructor.
     *
     * @param Container $container
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * @return Container
     */
    public function getContainer() {
        return $this->container;
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function signUp($data)
    {
        $route = 'auth/signup';

        $response = $this->sendRequest($route, false, $data);

        if ($response->status === self::STATUS_STRING_OK) {
            $this->authorizeUser($response->token);
        }

        return $response;
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function signIn($data)
    {
        $route = 'auth/signin';

        $response = $this->sendRequest($route, false, $data);

        if ($response->status === self::STATUS_STRING_OK) {
            $this->authorizeUser($response->token);
        }

        return $response;
    }

    /**
     * @return mixed
     */
    public function getUserInfo()
    {
        $route = 'auth/info';

        return $this->sendRequest($route, true);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function forgotPassword($data)
    {
        $route = 'auth/password/forgot';

        $data['redirectUrl'] = AMELIA_PAGE_URL . 'wpamelia-notifications&notificationTab=sms';

        return $this->sendRequest($route, false, $data);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function resetPassword($data)
    {
        $route = 'auth/password/reset';

        return $this->sendRequest($route, false, $data);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function changePassword($data)
    {
        $route = '/auth/password/change';

        return $this->sendRequest($route, true, $data);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function getCountryPriceList($data)
    {
        $route = '/sms/prices/' . strtoupper($data['selectedCountry']);

        return $this->sendRequest($route, true);
    }

    /**
     * @param $data
     *
     * @return mixed
     *
     * @throws QueryExecutionException
     * @throws ContainerException
     * @throws NotFoundException
     */
    public function testNotification($data)
    {
        $route = '/sms/send';

        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('domain.settings.service');

        /** @var EmailNotificationService $notificationService */
        $notificationService = $this->container->get('application.emailNotification.service');

        /** @var PlaceholderService $placeholderService */
        $placeholderService = $this->container->get("application.placeholder.{$data['type']}.service");

        $appointmentsSettings = $settingsService->getCategorySettings('appointments');

        $notification = $notificationService->getById($data['notificationTemplate']);

        $dummyData = $placeholderService->getPlaceholdersDummyData('sms');

        $isForCustomer = $notification->getSendTo()->getValue() === NotificationSendTo::CUSTOMER;

        $placeholderStringRec  = 'recurring' . 'Placeholders' . ($isForCustomer ? 'Customer' : '') . 'Sms';
        $placeholderStringPack = 'package' . 'Placeholders' . ($isForCustomer ? 'Customer' : '') . 'Sms';

        $dummyData['recurring_appointments_details'] = $placeholderService->applyPlaceholders($appointmentsSettings[$placeholderStringRec], $dummyData);
        $dummyData['package_appointments_details']   =  $placeholderService->applyPlaceholders($appointmentsSettings[$placeholderStringPack], $dummyData);


        $body = $placeholderService->applyPlaceholders(
            $notification->getContent()->getValue(),
            $dummyData
        );

        $data = [
            'to'   => $data['recipientPhone'],
            'from' => $settingsService->getSetting('notifications', 'smsAlphaSenderId'),
            'body' => $body
        ];

        return $this->sendRequest($route, true, $data);
    }

    /**
     * @param $to
     * @param $body
     * @param $callbackUrl
     *
     * @return mixed
     */
    public function send($to, $body, $callbackUrl)
    {
        $route = '/sms/send';

        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('domain.settings.service');

        $data = [
            'to'          => $to,
            'from'        => $settingsService->getSetting('notifications', 'smsAlphaSenderId'),
            'body'        => $body,
            'callbackUrl' => $callbackUrl
        ];

        return $this->sendRequest($route, true, $data);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function refreshSMSHistory($data)
    {
        $route = "/sms/refresh/{$data['logId']}";

        return $this->sendRequest($route, true);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function paymentCheckout($data)
    {
        $route = '/payment/checkout';

        $data['redirectUrl'] = AMELIA_PAGE_URL . 'wpamelia-notifications&notificationTab=sms';

        return $this->sendRequest($route, true, $data);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function paymentComplete($data)
    {
        $route = '/payment/complete';

        return $this->sendRequest($route, true, $data);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    public function getPaymentHistory($data)
    {
        $route = '/payment/history';

        return $this->sendRequest($route, true, $data);
    }

    /**
     * @param $token
     */
    private function authorizeUser($token)
    {
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('domain.settings.service');

        $settingsService->setSetting('notifications', 'smsSignedIn', true);

        $settingsService->setSetting('notifications', 'smsApiToken', $token);
    }
}
