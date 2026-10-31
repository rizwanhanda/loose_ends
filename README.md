# Aegis — encrypted, local-first collaboration

Aegis is a non-combat, offline-first field-coordination prototype. Devices keep their own append-only CRDT operation log and converge after arbitrary-order synchronization without a cloud service.

## Architecture implemented

- **Cross-device local relay:** a stateless `ws` server forwards opaque binary frames to connected devices. It never reads, stores, or interprets CRDT data.
- **Lamport clocks:** every operation has `{ logicalTime, deviceId }`; IDs are exactly `<logicalTime>-<deviceId>`. Incoming operations advance the local clock with `max(local, incoming) + 1`.
- **RGA CRDT:** inserts are ordered by Lamport time then device ID; deletes are retained as tombstones, making merge deterministic, commutative, and idempotent.
- **AES-GCM transport encryption:** browser clients encrypt every relay frame using Web Crypto before it leaves the device. A failed decryption is dropped.
- **PWA build:** Vite PWA precaches the app shell, JavaScript, CSS, manifest, and service worker for offline loading after its first successful visit.

## Run a local-network demo

Install dependencies once:

```powershell
npm install
```

In terminal 1, start the opaque relay:

```powershell
npm run relay
```

In terminal 2, build and serve the HTTPS PWA:

```powershell
npm run build
npm run preview
```

Find the host computer's Wi-Fi IPv4 address with `ipconfig`. On every device connected to that same offline router or mobile hotspot, open:

```text
https://<host-wifi-ip>:5173
```

The development certificate is self-signed. Each demo device must manually trust or proceed through its browser's local-certificate warning before Web Crypto and the service worker can run on the LAN IP.

The client defaults to the secure same-origin relay proxy:

```text
wss://<host-wifi-ip>:5173/relay
```

Do not change it to `ws://…` when the page is HTTPS; browsers will block mixed content. Enter the same pairing code, such as `RELAY-42`, on both devices.

## Demo-only pre-shared key

`.env` contains a generated 256-bit demo key used by Vite as `VITE_AEGIS_PSK`. It must be identical on all clients for them to decrypt relay frames. It is excluded from Git.

For a production system, replace this shared demo key with authenticated per-device identities, an approved key-exchange protocol, key rotation, revocation, secure hardware storage, and independent security review.

## Scope limits

This is a hackathon demonstrator, not a military-grade or certified system. It does not yet implement device signatures, formal role-policy enforcement, encrypted IndexedDB at rest, secure device provisioning, or cross-device WebRTC/Wi-Fi Direct discovery.
